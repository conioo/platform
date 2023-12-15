export default class File {
    name: string;
    id: string;
    isPublic: boolean;

    constructor(name: string, id: string, isPublic: boolean) {
        this.name = name;
        this.id = id;
        this.isPublic = isPublic;
    }
}