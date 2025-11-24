export enum AppStatus {
  IDLE = 'IDLE',
  EXTRACTING = 'EXTRACTING',
  ANALYZING = 'ANALYZING',
  GENERATING_PPT = 'GENERATING_PPT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SlideData {
  title: string;
  bullets: string[];
  speakerNotes: string;
}

export interface PresentationData {
  topic: string;
  summary: string;
  slides: SlideData[];
}

export interface ProcessingError {
  message: string;
  details?: string;
}
