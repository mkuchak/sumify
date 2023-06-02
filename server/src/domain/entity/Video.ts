import { FormatTime } from "@/domain/service/FormatTime";

export interface VideoProps {
  title?: string;
  thumbnail?: string;
  url?: string;
  dialogs: Dialog[];
}

export interface Dialog {
  text: string;
  duration: number;
  offset: number;
}

export interface Segment {
  text: string;
  start: number;
  end: number;
  startFormatted?: string;
  endFormatted?: string;
}

export class Video {
  title: string;
  thumbnail: string;
  url: string;
  dialogs: Dialog[] = []; // original transcript dialogs
  segments: Segment[] = []; // segments of the text split between X seconds
  chunks: string[] = []; // chunks of text split in parts (do it according to the tokens limit)

  constructor(props: VideoProps) {
    Object.assign(this, props);
  }

  get transcript(): string {
    return this.dialogs
      .reduce((prev: string, curr: Dialog) => `${prev} ${curr.text.trim()}`, "")
      .replace(/\[.*?\]/g, "")
      .trim();
  }

  segmentByTime(seconds = 300): void {
    const time = seconds * 1000;
    const segments: Segment[] = [];

    let chunk = 1;
    let segmentText = "";

    this.dialogs.forEach(({ text, offset }, i) => {
      const isLastDialog = i === this.dialogs.length - 1;

      if (offset <= time * chunk) {
        segmentText += ` ${text}`;
      } else {
        segments.push({
          text: segmentText.replace(/\[.*?\]/g, "").trim(),
          start: time * (chunk - 1),
          end: time * chunk - 1,
          startFormatted: FormatTime.format(time * (chunk - 1)),
          endFormatted: FormatTime.format(time * chunk - 1000),
        });

        segmentText = text;
        chunk++;
      }

      const hasText = segmentText.replace(/\[.*?\]/g, "").trim().length;

      if (isLastDialog && hasText) {
        segments.push({
          text: segmentText.replace(/\[.*?\]/g, "").trim(),
          start: time * (chunk - 1),
          end: time * chunk - 1,
          startFormatted: FormatTime.format(time * (chunk - 1)),
          endFormatted: FormatTime.format(time * chunk - 1000),
        });
      }
    });

    this.segments = segments;
  }

  segmentByCharacters(size = 1000, overlapSize = 200): void {
    const segments: Segment[] = [];

    let segmentText = "";
    let start = 0;

    this.dialogs.forEach(({ text, offset }, i) => {
      const isLastDialog = i === this.dialogs.length - 1;
      segmentText += ` ${text}`;

      if (segmentText.length >= size) {
        segments.push({
          text: segmentText.replace(/\[.*?\]/g, "").trim(),
          start,
          end: offset,
          startFormatted: FormatTime.format(start),
          endFormatted: FormatTime.format(offset),
        });
        segmentText = segmentText.slice(size - overlapSize);
        start = offset;
      }

      if (isLastDialog) {
        segments.push({
          text: segmentText.replace(/\[.*?\]/g, "").trim(),
          start,
          end: offset,
          startFormatted: FormatTime.format(start),
          endFormatted: FormatTime.format(offset),
        });
      }
    });

    this.segments = segments;
  }

  chunk(parts: number): void {
    const transcript = this.transcript;
    const chunkSize = Math.ceil(transcript.length / parts);
    const chunks: string[] = [];
    let start = 0;

    for (let i = 0; i < parts; i++) {
      let end = start + chunkSize;
      if (end < transcript.length && !/\s/.test(transcript.charAt(end))) {
        end = transcript.lastIndexOf(" ", end) + 1;
      }
      chunks.push(transcript.slice(start, end));
      start = end;
    }

    this.chunks = chunks;
  }
}
