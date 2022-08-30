const { getCurrentContents } = require("../services/ContentService");
const { getCurrentHypothesis } = require("../services/HypothesisService");
const { getCurrentObjectives } = require("../services/ObjectiveService");
const { getCurrentProblems } = require("../services/ProblemService");
const { getCurrentProjectVariables } = require("../services/ProjectVariableService");
const { getCurrentTitle } = require("../services/TitleService");
const { getVariables } = require("../services/VariableService");
const { getVerbs } = require("../services/VerbService");


const getAllVariables = async () => {
    const querySnapshot = await getVariables();
    const docs = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({ label: data.value, value: doc.id });
    })
    return docs;
};

const getAllProjectVariables = async (projectId, variableValues) => {
    const querySnapshot = await getCurrentProjectVariables(projectId);
    const docs = [];
    querySnapshot.forEach((doc) => {
        const variable = variableValues.find(v => v.value == doc.data().variable);
        docs.push({ label: variable.label, value: variable.value });
    });
    return docs;
}

const getAllVerbs = async () => {
    const querySnapshot = await getVerbs();
    const docs = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({ label: data.value, value: doc.id });
    })
    return docs;
};

const getTitleById = async (projectId) => {
    try {
        const querySnapshot = await getCurrentTitle(projectId);
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        if (docs.length > 0) {
            const doc = docs[0];
            return doc;
        }
    } catch (error) {
        console.error(error);
    }
};

const getAllProblemsById = async (projectId) => {
    const querySnapshot = await getCurrentProblems(projectId);
    const docs = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({...doc.data(), id:doc.id});
    })
    return docs;
};

const getAllHypothesisById = async (projectId) => {
    const querySnapshot = await getCurrentHypothesis(projectId);
    const docs = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();        
        docs.push({...doc.data(), id:doc.id});
    })
    return docs;
};

const getAllObjectivesById = async (projectId) => {
    const querySnapshot = await getCurrentObjectives(projectId);
    const docs = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({...doc.data(), id:doc.id});
    })
    return docs;
};

const getAllContentsById = async (projectId) => {
    const querySnapshot = await getCurrentContents(projectId);
    const docs = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({...doc.data(), id:doc.id});  
    })
    return docs;
};

const getVariableLabel = (variableId, variables) => {
    const lookup = variables.find(x => x.value === variableId);
    return lookup != null ? lookup.label : "---";
};

const getVerbLabel = (verbId, verbs) => {
    const lookup = verbs.find(x => x.value === verbId);
    var resultStr = "---";
    if (lookup) {
        resultStr = lookup.label;
    }
    return resultStr;
};

const buildTitle = (title, variables) => {
    return `${getVariableLabel(title.first_variable, variables)} ${title.connector} ${getVariableLabel(title.second_variable, variables)} ${title.context_connector} ${title.population} - ${title.location} ${title.timestamp}`;
};

const buildProblem = (problem, variables) => {
    return `${problem.start} ${getVariableLabel(problem.first_variable, variables)} ${problem.connector} ${problem.order == 0 ? problem.context_connector : `${problem.dimension} ${getVariableLabel(problem.second_variable, variables)}`} ${problem.population} - ${problem.location}, ${problem.timestamp}?`;
};

const buildHypothesis = (hypothesis, variables) => {
    return `${getVariableLabel(hypothesis.first_variable, variables)} ${hypothesis.connector} ${hypothesis.order == 0 ? hypothesis.context_connector : `${hypothesis.dimension} ${getVariableLabel(hypothesis.second_variable, variables)}`} ${hypothesis.population} - ${hypothesis.location}, ${hypothesis.timestamp}`;
};

const buildObjective = (objective, variables, verbs) => {
    return `${objective.order == 0 ? getVerbLabel(objective.verb, verbs) : `${getVerbLabel(objective.verb, verbs)} ${objective.start}`} ${getVariableLabel(objective.first_variable, variables)} ${objective.connector} ${objective.order == 0 ? objective.context_connector : `${objective.dimension} ${getVariableLabel(objective.second_variable, variables)}`} ${objective.population} - ${objective.location}, ${objective.timestamp}`;
};

export const buildProject = async (projectId) => {
    var variables = await getAllVariables();
    var verbs = await getAllVerbs();
    var title = await getTitleById(projectId);
    var problems = await getAllProblemsById(projectId);
    var hypothesis = await getAllHypothesisById(projectId);
    var objectives = await getAllObjectivesById(projectId);
    var contents = await getAllContentsById(projectId);
    const parts = [];
    parts.push({Key: 0, Value: buildTitle(title, variables), IsGeneral: false, Order: 0, Category: 0});
    problems.forEach(problem => {
        parts.push({Key: 1, Value: buildProblem(problem, variables), IsGeneral: problem.is_general, Order: problem.order, Category: 0 });
    });
    hypothesis.forEach(hypothesis => {
        parts.push({Key: 2, Value: buildHypothesis(hypothesis, variables), IsGeneral: hypothesis.is_general, Order: hypothesis.order, Category: 0 });
    });
    objectives.forEach(objective => {
        parts.push({Key: 3, Value: buildObjective(objective, variables, verbs), IsGeneral: objective.is_general, Order: objective.order, Category: 0 });
    });
    contents.forEach(content => {
        parts.push({Key: 4, Value: content.content, IsGeneral: false, Order: 0, Category: content.category });
    });
    return parts;
}; 