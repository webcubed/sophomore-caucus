# Stuyvesant Sophomore Caucus 26-27 website

## Stack

- React
- Typescript
- TailwindCSS
- Next.js App router
- Postcss
- Motion
- Simple Icons
- Lucide Icons
- sanity.io as headless CMS

## Development

### Building

1. Install dependencies: `pnpm install`
2. Create a sanity.io project and fill in .env.local
3. Run build command `pnpm build`

- To run dev server, run `pnpm dev`

### Contributing

#### Naming conventions
Please use commit messages and branch names that are concise; they should be short and people should be able to easily imply what has changed.
##### Examples of bad commit names:
- asdf
- pls work
- fixed issue
- make the thingie do the thingie
##### Good commit names:
- Update dependencies
- Fix header appearance behavior
- Remove unnecessary logic for table of contents behavior
- If you really want to get fancy with it, you can use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
##### Good branch naming examples
- style-fixes
- text-editor
- cleanup
##### AVOID naming branches using dates or long/unnecessary info
- 03_23_update
- 04_10_work
- work
- work-for-the-issue-im-assigned-to-and-trying-to-fix
(ripped straight from SU IT slides)
