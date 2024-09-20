export default `Usage: fourtune <project_root> --target <realm>:<type> [...flags] [...options]

    Required options and their meaning:

        --target <realm>:<type>

            Possible values for <realm> are:

                js
                    For javascript targets.
                    This includes command-line apps, libraries and classes.

                web
                    For web targets.
                    This includes web apps and web component libraries.

                c
                    For C targets.
                    This includes command-line apps and libraries.

            The possible values for <type> depend on the specific realm chosen:

                js:app - javascript command line application
                js:library - javascript library
                js:class - javascript class definition

                web:app - web application
                web:library - web components library

                c:app - c command line application
                c:library - c library

    All other flags and options are passed down.
`
