function ImageTag(props: any) {
  return <img src={props.src} {...props} crossOrigin />;
}

export default ImageTag;
