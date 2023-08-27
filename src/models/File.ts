export class File {
    path: string
    content: string;

    constructor(path: string, content: string) {
        this.path = path;
        this.content = content;
    }
}