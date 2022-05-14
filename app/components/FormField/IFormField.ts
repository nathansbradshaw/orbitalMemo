export interface IFormField {
    htmlFor: string
    label: string
    type?: string
    value: any
    onChange?: (...args: any) => any
    error?: string
  }
  