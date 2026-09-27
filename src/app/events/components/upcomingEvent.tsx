

export type UpcomingEventProps = {
    first: boolean;
    colorNum: number;
	eventName: string;
	date: string;
    room?: number | null;
	description: string;
	image?: string | null;
};

function getColor(colorNum: number, aspect: string) {
    let colors = [
        'blue', 'mauve', 
        'sapphire', 'peach', 
        'green', 'yellow', 
        'lavender', 'teal', 
        'red'];
    return `${aspect}-${colors[colorNum]}`;
}

export default function UpComingEvent({ first, colorNum, eventName, date, room, description, image }: UpcomingEventProps) {

    const borderColor = getColor(colorNum, 'border');
    const textColor = getColor(colorNum, 'text');
    return (
        <div className={`${borderColor} ${textColor} mb-8 p-7 border-2 ${first? 'border-solid border-4' : 'border-double'} rounded-[20px] bg-surface0`}>
            <h2>{eventName}</h2>
            <div className="border-b border-gray-300 my-2"></div>    
            <p className={textColor}>{date}</p>
            {room && <p className={textColor}>Room: {room}</p>}
            <div className="my-2"></div>
            <p className={textColor + " text-sm"}>{description}</p>
            {image && <img src={image} alt="" />}
        </div>
    )
}