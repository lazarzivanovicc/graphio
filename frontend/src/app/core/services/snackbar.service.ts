import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})

export class SnackBarService {

    private snackQueue: SnackBarMessage[] = [];
    private isInstanceVisible = false;
    private snackBarRef!: MatSnackBarRef<SimpleSnackBar>;

    constructor(private snackBar: MatSnackBar) {
    }

    open(message: string, config?: MatSnackBarConfig, action?: string) {
        if (!config) {
            config = new MatSnackBarConfig();
            config.duration = 2000;
        }
        this.snackQueue.push(new SnackBarMessage(message, action!, config));
        if (!this.isInstanceVisible) {
            this.showNext();
        }
    }

    private showNext() {
        if (this.snackQueue.length === 0) {
            return;
        }

        const message = this.snackQueue.shift();
        this.isInstanceVisible = true;
        this.snackBarRef = this.snackBar.open(message!.message, message!.action, message!.config);
        this.snackBarRef.afterDismissed().subscribe(() => {
            this.isInstanceVisible = false;
            this.showNext();
        });
    }

    error(text: string) {
        const config = new MatSnackBarConfig();
        config.duration = 5000;
        config.panelClass = 'snackbar-error';
        config.verticalPosition = 'top';
        console.log(text);
        this.open(text, config);
    }

    success(text: string) {
        const config = new MatSnackBarConfig();
        config.duration = 5000;
        config.panelClass = 'snackbar-success';
        config.verticalPosition = 'top';
        this.open(text, config);
    }

    info(text: string) {
        const config = new MatSnackBarConfig();
        config.duration = 7000;
        config.panelClass = 'snackbar-info';
        config.verticalPosition = 'top';
        this.open(text, config);
    }
}

class SnackBarMessage {
    message: string;
    action: string;
    config: MatSnackBarConfig;

    constructor(message: string, action: string, config: MatSnackBarConfig) {
        this.message = message;
        this.action = action;
        this.config = config;
    }
}