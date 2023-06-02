export class FormatTime {
  static format(milliseconds: number): string {
    const date = new Date(milliseconds);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    if (hours > 0) {
      return `${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
    }
  }
}
