"use client";
const resources = [
    {
        name: "Teacher Email Guide",
        description: "Learn how to properly email teachers!",
        url: "https://docs.google.com/document/d/1dVnQkHagjMZy40AnXV4r7JmwPSiwvXZV_MMmlhzEbvc/edit?tab=t.0",
    },
    {
        name: "Stuyvesant Staff Email List",
        description: "The Fall 2026 Stuyvesant staff email directory.",
        url: "https://stuy.entest.org/staff%20email%20list%20Fall%202026%20updated_%20pdf.pdf",
    },
    {
        name: "Sophomore monthly magazine",
        description: "A brief overview of what Sophomore Caucus has to offer for this month, including our resources and upcoming events!",
        url: "https://www.instagram.com/p/DdpWVYOib2r/",
    },
    {
        name: "Official Unit 1 AP Chemistry Study Guide 26-27",
        description: "The official Unit 1 AP Chemistry study guide for 2026–27.",
        url: "https://docs.google.com/document/d/1Pb7y2LPXEVJjcPq9XA8I_AWsx6f_LlB6rHWG7TWz8CQ/edit?tab=t.d3xer7k4938x",
    },
    {
        name: "Sophomore Caucus Extracurricular Activities Guide",
        description: "A guide to extracurricular activities for Stuyvesant sophomores.",
        url: "https://docs.google.com/document/d/1kvo8HDMRVK3RtqtXhcF78Db4KFHdMvwCmaN1pj2xCcU/edit?tab=t.0",
    },
    {
        name: "Suicide Prevention",
        description: "Resources and information for suicide prevention and support.",
        url: "https://docs.google.com/document/d/1sBOQfI91HhRRXh-VUhLQKzBkzLSn0zDOiwEeW9FKK5Y/edit?tab=t.0",
    },
    {
        name: "Sophomore Caucus Q&A",
        description: "Frequently asked questions and answers from the Sophomore Caucus.",
        url: "https://docs.google.com/document/d/1kPC-xYEkF1FdC91UEcHP5_yimnNUxNsLtLPLC1ZpaUQ/edit?tab=t.0",
    },
    {
        name: "AP Chem Roadmap",
        description: "A roadmap for AP Chemistry.",
        url: "https://docs.google.com/document/d/1WLd4Tl6mYBROLGYHLNr5FnYnlU2Gk_CrUJHISv4Zu6c/edit?tab=t.89tbj24s39ph",
    },
];

export default function Resources() {
    return (
		<div>
        {resources.map(
			(resources) => (
				<div className="mb-12">
					<h2>{resources.name}</h2>
					<p>{resources.description}</p>
					<a
						href={resources.url}
						target="_blank"
						rel="noopener noreferrer"
						
					>
						Link to Resource!</a>
				</div>
			)
		)}

		<h2 className="mb-4">Stuy Food Map!</h2>
		<iframe
            src="https://www.google.com/maps/d/embed?mid=1mrPR5pzLzQE78MsK0zgHrBFKs6CKnyo"
            width="100%"
            height="500"
            style={{ border: 0 }}
            loading="lazy"
        ></iframe>
		</div>
    );
}