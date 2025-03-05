// keystatic.config.ts
import {collection, config, fields} from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    ui: {
        brand: {
            name: 'martengierth.de',
        },
        navigation: {
            'Content': ['projects'],
        },
    },

    collections: {
        projects: collection({
            label: 'Projects',
            path: 'src/content/projects/*',
            slugField: 'title',
            format: {data: 'json'},
            columns: ['title', 'date', 'category', 'visible'],
            schema: {
                visible: fields.checkbox({
                    label: 'Visible',
                    description: 'Set this project as visible to publish it.',
                    defaultValue: true,
                }),
                title: fields.slug({
                    name: {
                        label: 'Title',
                    },
                }),
                date: fields.date({
                    label: 'Date',
                    description: 'Provide a date for the project.',
                }),
                description: fields.text({
                    label: 'Description',
                    description: 'Provide a description for the project.',
                    multiline: true
                }),
                image: fields.image({
                    label: 'Project Image',
                    description: 'Upload an image for the project.',
                    directory: 'public/assets/projects',
                    publicPath: '/assets/projects/',
                }),
                category: fields.multiselect({
                    label: 'Category',
                    description: 'Provide a category for the project.',
                    options: [
                        // Digital media
                        {label: 'Video', value: 'Video'},
                        {label: 'Music', value: 'Music'},
                        {label: 'Photography', value: 'Photography'},
                        {label: 'Design', value: 'Design'},

                        // Interactive and software projects
                        {label: 'Game', value: 'Game'},
                        {label: 'Web', value: 'Web'},
                        {label: 'App', value: 'App'},
                        {label: 'Interactive', value: 'Interactive'},
                        {label: 'Programming', value: 'Programming'},

                        // Theoretical and experimental work
                        {label: 'Research', value: 'Research'},

                        // Miscellaneous
                        {label: 'Other', value: 'Other'},
                    ],
                    defaultValue: [],
                }),
                projectTags: fields.array(
                    fields.text({
                        label: 'Tag',
                    }),
                    {
                        label: 'Project Tags',
                        itemLabel: (props) => props.value || 'No Tag',
                    }
                ),
                collaborations: fields.array(
                    fields.object({
                        name: fields.text({
                            label: 'Collaboration Name',
                        }),
                        link: fields.url({
                            label: 'Collaboration Link',
                        }),
                    }),
                    {
                        label: 'Collaborations',
                        itemLabel: (props) =>
                            `${props.fields.name.value} (${props.fields.link.value})`,
                    }
                ),
                links: fields.array(
                    fields.object({
                        chipType: fields.text({
                            label: 'Chip Type',
                        }),
                        chipColor: fields.text({
                            label: 'Chip Color',
                        }),
                        chipText: fields.text({
                            label: 'Chip Text',
                        }),
                        url: fields.url({
                            label: 'URL',
                        }),
                    }),
                    {
                        label: 'Links',
                        itemLabel: (props) =>
                            `[${props.fields.chipType.value}] ${props.fields.chipText.value} (${props.fields.url.value})`,
                    }
                ),
                imagelink: fields.url({
                    label: 'Image Link',
                    description: 'Provide a link to an image if needed.',
                }),
            },
        })
        ,
    },
})
;