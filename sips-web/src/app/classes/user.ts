export class User {
  constructor(
    public kind: string,
    public created_at: string,
    public _id: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    private password: string,
    public organization: {
      _id: string,
      title: string,
      createdAt: string,
      creator: string
    }) { }
}
