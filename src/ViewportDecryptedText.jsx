import DecryptedText from "./DecryptedText";

export default function ViewportDecryptedText({
  text,
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  speed = 28,
  ...props
}) {
  return (
    <DecryptedText
      text={text}
      animateOn="view"
      speed={speed}
      sequential={true}
      className={className}
      encryptedClassName={encryptedClassName || `${className} opacity-45`.trim()}
      parentClassName={parentClassName}
      {...props}
    />
  );
}
