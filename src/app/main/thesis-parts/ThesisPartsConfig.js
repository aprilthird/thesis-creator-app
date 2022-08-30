import ContentEditor from "./content-editor/ContentEditor";
import HypothesisEditor from "./hypothesis-editor/HypothesisEditor";
import ObjectiveEditor from "./objective-editor/ObjectiveEditor";
import ProblemEditor from "./problem-editor/ProblemEditor";
import TitleEditor from "./title-editor/TitleEditor";


const ThesisPartsConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'proyectos/:id/titulo',
            element: <TitleEditor />,
        },
        {
            path: 'proyectos/:id/problema',
            element: <ProblemEditor />
        },
        {
            path: 'proyectos/:id/hipotesis',
            element: <HypothesisEditor />
        },
        {
            path: 'proyectos/:id/objetivos',
            element: <ObjectiveEditor />,
        },
        {
            path: 'proyectos/:id/contenido',
            element: <ContentEditor />,
        },
    ],
};

export default ThesisPartsConfig;