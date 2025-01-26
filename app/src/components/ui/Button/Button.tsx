import './button.css'

export type ButtonProps = {
  type: 'button' | 'linkButton',
  text: string,
  url?: string,
}

export default function Button({ type, text, url }: ButtonProps) {
  return (
    type === 'linkButton' ?
      <a href={url} className="link-button">{text}</a>
      : <button>{text}</button>
  )
}