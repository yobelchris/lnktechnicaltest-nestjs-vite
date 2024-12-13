export default class JWTPayload {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  ToObject(): object {
    return {
      id: this.id,
    };
  }
}
