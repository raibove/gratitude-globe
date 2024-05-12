interface Props{
    previewTitle: string,
    tag: string
}

const PreviewCard = ({previewTitle, tag}: Props)=>{
    return (
        <div className="preview-card">
            <span>{previewTitle}</span>
            <span className="tag display-tag">{tag}</span>
        </div>
    )
} 

export default PreviewCard;