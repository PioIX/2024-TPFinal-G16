const Media = ({ media }) => (
    <div>
        {media.map((item, index) => (
            <img key={index} src={item.url} alt={`Media item ${index}`} />
        ))}
    </div>
);

export default Media;