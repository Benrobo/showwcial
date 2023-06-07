function ImageTag(props: any) {
  return <img src={props.src} {...props} crossorigin />;
}

export default ImageTag;
