export default function QueryDuration({duration}:{duration:number}) {
    const unit = 'ms';
    return (
        <span>{duration || 'N/A'} {unit}</span>
    )
};

