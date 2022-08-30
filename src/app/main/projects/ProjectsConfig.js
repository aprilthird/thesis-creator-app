import ProjectDetail from "./detail/ProjectDetail";
import ProjectForm from "./form/ProjectForm";
import ProjectsList from "./list/ProjectsList";
import ProjectPreview from "./preview/ProjectPreview";
import ProjectVariables from "./variables/ProjectVariables";
import ProjectVersions from "./versions/ProjectVersions";

const ProjectsConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'proyectos',
            element: <ProjectsList />,
        },
        {
            path: 'proyectos/crear',
            element: <ProjectForm />
        },
        {
            path: 'proyectos/:id/editar',
            element: <ProjectForm />
        },
        {
            path: 'proyectos/:id/detalle',
            element: <ProjectDetail />,
        },
        {
            path: 'proyectos/:id/variables',
            element: <ProjectVariables />,
        },
        {
            path: 'proyectos/:id/versiones',
            element: <ProjectVersions />,
        },
        {
            path: 'proyectos/:id/previsualizacion',
            element: <ProjectPreview />,
        }
    ],
};

export default ProjectsConfig;