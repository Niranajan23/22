
import PptxGenJS from 'pptxgenjs';
import { PresentationData } from '../types';

export const generatePptFile = (data: PresentationData): void => {
  const pptx = new PptxGenJS();

  // Set Presentation Properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = data.topic;
  pptx.subject = data.summary;

  // --- Title Slide ---
  const slideTitle = pptx.addSlide();
  
  // Background styling for title slide
  slideTitle.background = { color: '4F46E5' }; // Indigo-600
  
  slideTitle.addText(data.topic, {
    x: 0.5, y: 2.5, w: '90%', h: 1.5,
    fontSize: 44,
    color: 'FFFFFF',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  });
  
  slideTitle.addText(data.summary, {
    x: 1, y: 4.2, w: '80%', h: 1,
    fontSize: 18,
    color: 'E0E7FF', // Indigo-100
    align: 'center',
    fontFace: 'Arial',
    italic: true
  });

  // --- Content Slides ---
  data.slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    
    // Add Slide Number
    slide.addSlideNumber({ x: '95%', y: '92%', fontSize: 10, color: '888888' });

    // Slide Title Bar
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.2, fill: 'F3F4F6' });
    slide.addText(slideData.title, {
      x: 0.5, y: 0.1, w: '90%', h: 1,
      fontSize: 28,
      color: '1F2937', // Gray-800
      bold: true,
      fontFace: 'Arial'
    });

    // Bullets
    slide.addText(slideData.bullets.map(b => ({ text: b, options: { breakLine: true } })), {
      x: 0.5, y: 1.5, w: '90%', h: 4.5,
      fontSize: 18,
      color: '374151', // Gray-700
      bullet: { type: 'number', code: '2022' },
      paraSpaceAfter: 10,
      fontFace: 'Arial',
      lineSpacing: 28
    });

    // Speaker Notes
    slide.addNotes(slideData.speakerNotes);
  });

  // Trigger Download
  pptx.writeFile({ fileName: `${data.topic.replace(/[^a-z0-9]/gi, '_').substring(0, 20)}_Presentation.pptx` });
};
