

export type UpcomingEventProps = {
    colorNum: number;
	eventName: string;
	date: string;
    room?: number | null;
	description: string;
	image?: string | null;
};

export default function UpComingEvent({ colorNum, eventName, date, room, description, image }: UpcomingEventProps) {
    let colors = [
        'text-blue', 'text-mauve', 
        'text-sapphire', 'text-peach', 
        'text-green', 'text-yellow', 
        'text-lavender', 'text-teal', 
        'text-red'];
    return (
        <div className={colors[colorNum]}>
            <h2>{eventName}</h2>
            <div className="w-1/2 border-b border-gray-300 my-2"></div>    
            <p className={colors[colorNum]}>{date}</p>
            {room && <p className={colors[colorNum]}>Room: {room}</p>}
            <p className={colors[colorNum]}>{description}</p>
            {image && <img src={image} alt='No Image Found.'/>}
        </div>
    )
}