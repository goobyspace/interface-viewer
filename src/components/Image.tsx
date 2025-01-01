function Description({ image }: { image: string }) {
  return (
    <>
      <div className="image-preview">
        <img src={image} alt="wow interface image" />
      </div>
    </>
  );
}

export default Description;
