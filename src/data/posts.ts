export interface BlogPost {
    id: string;
    title: string;
    date: string;
    summary: string;
    slug: string;
    contentFile: string;
}

export const posts: BlogPost[] = [
    {
        id: '1',
        title: 'Project MKUltra: Declassified',
        date: '1983-11-06',
        summary: 'Notes on the recent findings in the Hawkins National Laboratory restricted wing.',
        slug: 'mkultra-declassified',
        contentFile: 'example-post.md'
    }
];
