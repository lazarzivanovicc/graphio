from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi, FetchedTranscript
from urllib.parse import urlparse, ParseResult, parse_qs
import logging
from google import genai
from dotenv import load_dotenv
from google.genai import types
import os
from langchain_neo4j import Neo4jGraph

load_dotenv()

google_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
logger = logging.getLogger(__name__)
ytt_api = YouTubeTranscriptApi()

# Models
class NLanguageToCypher(BaseModel):
    query: str
    reasoning: str

class CypherToNLanguage(BaseModel):
    response: str
    reasoning: str

class TranscriptRequest(BaseModel):
    url: str 

class Node(BaseModel):
    id: str
    label: str

class Relationship(BaseModel):
    source: Node
    target: Node
    type: str

class KnowledgeGraph(BaseModel):
    nodes: List[Node]
    relationships: List[Relationship]


# Graph RAG
graph: Neo4jGraph = Neo4jGraph(
    url=os.getenv("NEO4J_URL"),
    username=os.getenv("NEO4J_USER"),
    password=os.getenv("NEO4J_PASSWORD"),
)


def ask_graph(query: str, graph: Neo4jGraph):
    graph_schema: str = graph.schema
    cypher_rsp: NLanguageToCypher = nl_to_cypher(query, graph_schema)
    try:
        cypher_query = cypher_rsp.query
        query_res: list[dict] = graph.query(cypher_query)
        nl_rsp: CypherToNLanguage = cypher_to_nl(query, graph_schema, query_res)
        print(nl_rsp.response)
        return nl_rsp.response
    except Exception as e:
        print(e) # I have to switch to logger and handle this properly


def nl_to_cypher(query: str, graph_schema: str): # I have to check how will I handle more complex queries
    """
    Function that uses LLM to conver natural language query to Cypher based on graph schema

    Args:
        query (str): natural language query
        graph_schema (str): schema of Neo4j graph database

    Returns:
        NLanguageToCypher: Cypher representation of users query
    """
    prompt = f"""
    You are Neo4j Cypher expert. You will be given a user query in natural language and graph database schema.
    Your task is to create a Cypher query that matches user query using graph schema. Additionaly you will provide short reasoning how and why you decided to construct Cypher query in a particular way. This will serve as a logical check for engineers and should allow easy debugging.

    <QUERY>
    {query}
    </QUERY>

    <GRAPH_SCHEMA>
    {graph_schema}
    </GRAPH_SCHEMA>
    """

    response = google_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[{
            "role": "user",
            "parts": [{
                        "text": prompt
                    }]
            }],
            config=types.GenerateContentConfig(
                response_mime_type = 'application/json',
                response_schema = NLanguageToCypher,
            )
        )
    
    return response.parsed


def cypher_to_nl(user_query: str, graph_schema: str, cypher_query_results: list[dict]):
    """
    Function that uses LLM to conver results of execution of Cypher query to natural language based on initial user query and results

    Args:
        user_query (str): natural language query
        graph_schema (str): schema of Neo4j graph database
        cypher_query_results (str): 

    Returns:
        CypherToNLanguage: Natural Language representation of results of Cypher query
    """
    prompt = f"""
    You are Neo4j Cypher expert. You will be given a response retreived from Neo4j obtained by using Cypher query.
    Your task is to create a accurate natural language interpretation of the result. Frame it as a response to the user query. Additionaly you will provide short reasoning how and why you decided to construct Cypher query in a particular way. This will serve as a logical check for engineers and should allow easy debugging.

    <QUERY>
    {user_query}
    </QUERY>

    <GRAPH_SCHEMA>
    {graph_schema}
    </GRAPH_SCHEMA>

    <CYPHER_QUERY_RESULTS>
    {cypher_query_results}
    </CYPHER_QUERY_RESULTS>
    """

    response = google_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[{
            "role": "user",
            "parts": [{
                        "text": prompt
                    }]
            }],
            config=types.GenerateContentConfig(
                response_mime_type = 'application/json',
                response_schema = CypherToNLanguage,
            )
        )
    
    return response.parsed

# Test query
# ask_graph("What is the name of the movie where Tom Cruise and Val Kilmer appear together?", graph)
     
app = FastAPI()
    
def get_video_id(url: str) -> str | None:
    """
    Receives url of a YouTube video and extracts id of a video
    
    Args:
        url (str): url of a YouTube video
    
    Returns:
        str | None: returns id if it is present in the url else returns Nones
    """
    parse_res: ParseResult = urlparse(url)
    query: list[str] | None = parse_qs(parse_res.query).get('v')
    if query:
        return query[0]
    return None


def get_video_transcript(video_id: str) -> tuple[str, str, bool]:
    """
    Fetches transcript of a YouTube video

    Args:
        id (str): id of video for which transcript will be fetched
    
    Returns:
        tuple[str, str, bool]: returns tuple with transcript of a YouTube video,
        language and flag if transcript was auto generated
    """
    transcript: FetchedTranscript = ytt_api.fetch(video_id, preserve_formatting=True)
    language: str = transcript.language
    is_generated: bool = transcript.is_generated
    clean_transcript: str = ""
    
    for split in transcript.snippets:
        clean_transcript += " " + split.text 

    return clean_transcript, language, is_generated


def extract_topics_of_transcript(transcript: str) -> list[str]:
    """
    Calls LLM in order to extract topics based on the given transcript

    Args:
        transcript (str): transcript of a YouTube video

    Returns:
        list[str]: list of topics related to transcript
    """

    return ["topic1"]


def summarize_transcript(transcript: str) -> str:
    """
    Calls LLM in order to summarize the transcript
    
    Args:
        transcript (str): transcript of a YouTube video

    Returns:
        str: summarization of a transcript
    """

    return "summary"

# Move the prompts to prompts directory
def create_knowledge_graph(transcript: str):
    """
    Calls LLM in order to create a knowledge graph
    """
    prompt: str = f"""
    You are expert in information extraction and knowledge graph creation.
    You will be passed text and your job is to extract entites and their relationships.
    Try to capture as much information as possible without sacrificing accuracy. Do not add any information that is not
    explicitly mentioned in the text. Ensure you are consistent with labeling and naming. Remeber that the knowledge graph must be coherent
    and easily understandable. Try keeping graph simple and general.

    <NODE_RULES>
    Nodes represent entities and concepts.
    Never utilize intigers for node IDs. Node IDs should be names or
    human-readable identifiers found in text.
    Node labels should always be general e.g. 'person' is prefered label to 'mathematician' for example beacuse the 'mathematician' is too specific.
    </NODE_RULES>

    <RELATIONSHIP_RULES>
    Relationships represent connections between entitites. They should be general and consistent.
    </RELATIONSHIP_RULES>

    
    <TEXT>
    {transcript}
    </TEXT>
    """

    response = google_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[{
            "role": "user",
            "parts": [{
                        "text": prompt
                    }]
            }],
            config=types.GenerateContentConfig(
                response_mime_type = 'application/json',
                response_schema = KnowledgeGraph,
            )
        )
    
    return response.parsed


@app.post("/videos")
def fetch_transcript(request: TranscriptRequest):
    url = request.url
    video_id: str | None = get_video_id(url)
    
    if not video_id:
        return "Error"
    clean_transcript, language, is_generated = get_video_transcript(video_id)
    graph = create_knowledge_graph(clean_transcript)
    # Now I should store this in Neo4j
    # Firstly I will do the simple graph creation and latter I want to implement something simular to Microsofts GraphRAG where I have communities and their respective summaries
    # For this I can try using SLM 
    # If this lasts for too long and I think I can create a backgound process that will handle all the work and immediately just notify the user
    # In case I opt for this to be a web app - I can also make it a console app

    return graph

if __name__ == "__main__":
    get_video_id("https://www.youtube.com/watch?v=nOxKexn3iBo")