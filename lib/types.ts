export enum TextType {
  Tutorial = 0,
  TermsAndConditions = 1,
  Questionnaires = 2,
  AboutUs = 3,
  Diary = 4,
  Agenda = 5
}

export interface Text {
  textId: number;
  text: string;
  textType: TextType;
  dateCreated: string;
  modifiedDate: string;
}

export interface TextCreateInput {
  text: string;
  textType: TextType;
}

export const TextTypeLabels: Record<TextType, string> = {
  [TextType.Tutorial]: 'Tutorial',
  [TextType.TermsAndConditions]: 'Términos y Condiciones',
  [TextType.Questionnaires]: 'Cuestionarios',
  [TextType.AboutUs]: 'Sobre Nosotros',
  [TextType.Diary]: 'Diario',
  [TextType.Agenda]: 'Agenda'
  
};