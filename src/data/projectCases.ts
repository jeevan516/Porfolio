/**
 * Problem -> solution -> result, one short sentence each, for every project card.
 *
 * Hand-written copy keyed by project id (journey ids "nf-*" from journey.generated.json, or the
 * card ids in portfolioData.ts). Sources:
 * - bootcamp projects: ~/Projects/project-notes/notes/<folder>.md ("Project" = problem,
 *   "Approach" = solution); the result line is the generated `headline` (real numbers from the run).
 * - other projects: only facts already on the card (description, impact, metrics).
 *
 * `result`: omitted = use the generated headline (bootcamp) or the card's `impact`;
 * `null` = the card has no measured result, so no result line is shown.
 * When a project is re-run and its numbers change, update its line here.
 */
import type { Project } from '../types';
import { JOURNEY, CURATED_CARD_FOR_FOLDER } from './journey';

export interface ProjectCase {
  problem: string;
  solution: string;
  result?: string | null;
}

export const PROJECT_CASES: Record<string, ProjectCase> = {
  // ---- neuefische bootcamp (keyed by journey id) -------------------------------------------------
  'nf-opps': {
    problem: 'Hard-to-read Python is costly to maintain.',
    solution: 'Refactored “bad example” code into clear names, small functions, classes and validated Pydantic models across 20 exercises, without changing what it does.',
  },
  'nf-pandas-and-numpy': {
    problem: 'Real CSV data is messy: it has to be cleaned before it can answer questions.',
    solution: 'Loaded, cleaned, grouped and plotted five real datasets with pandas, ending in an exploratory analysis of February 2014 bike-share trips.',
  },
  'nf-unit-integration-testing': {
    problem: 'How do you know data code keeps working after a change?',
    solution: 'Packaged the code in a source layout and covered it with parametrized pytest unit tests, data tests and integration tests against real files and SQLite.',
  },
  'nf-docker': {
    problem: 'A user-directory web service needs a typed API, a database and one way to start both.',
    solution: 'Built a typed FastAPI CRUD API on PostgreSQL, packaged it with Docker and ran API and database as one Docker Compose stack with health checks.',
  },
  'nf-mle-refactoring-project': {
    problem: 'A working but messy notebook predicts King County house prices, but none of it can be reused or tested.',
    solution: 'Moved cleaning, features and the model into a tested Python package, checked it against the notebook baseline, and added a FastAPI app, Docker Compose and CI.',
  },
  'nf-model-review-board': {
    problem: 'An ML team has to review model predictions before another department uses them.',
    solution: 'Built a Flask + SQLAlchemy CRUD app with a status dashboard and health check, tested it with pytest and deployed it on Render with managed PostgreSQL.',
  },
  'nf-web-service-deployment': {
    problem: 'A Dockerised web app has to move from a laptop to the cloud and be reachable from a browser.',
    solution: 'Ran the FastAPI image on a Google Cloud VM connected to Cloud SQL PostgreSQL 14 over a private IP, with every step scripted in a gcloud deploy script.',
  },
  'nf-data-pipeline-and-modelling': {
    problem: 'One raw table of a month of NYC yellow-taxi trips is hard to query for analytics.',
    solution: 'Loaded the Parquet file into PostgreSQL in 100,000-row chunks with a Python ETL script and remodelled it into five dimensions and one fact table.',
  },
  'nf-datapipeline-with-dbt': {
    problem: 'Raw NYC taxi rides have to become tested analytics tables inside Postgres.',
    solution: 'Modelled staging, intermediate and mart layers in dbt with a seed and data tests, and ran loader, dbt build and dashboard as one Docker stack.',
  },
  'nf-workflow-orchestration': {
    problem: 'Data jobs need to run on a schedule, retry on failure and be visible when they break.',
    solution: 'Orchestrated an ETL and an ELT pipeline for NYC taxi data with Prefect: retried loads into PostgreSQL, dbt transforms and scheduled deployments, checked in GitHub Actions.',
  },
  'nf-batch-and-stream-processing': {
    problem: 'When should data be processed all at once, and when one event at a time?',
    solution: 'Processed the same NYC taxi rides as a daily Prefect batch into Postgres and dbt, and as a live Redpanda stream with 3 exactly-once processors, watched by Prometheus and Grafana.',
  },
  'nf-data-pipeline-project': {
    problem: 'How much revenue did NYC green taxis take per day from January to March 2025?',
    solution: 'An ETL pipeline downloads the monthly trip files, turns each data finding into a tested cleaning rule and writes one revenue figure per day, as a CLI or a Prefect flow.',
  },
  'nf-prompt-engineering': {
    problem: 'How do you get support-triage answers from an LLM that you can trust and compare?',
    solution: 'Ran a baseline, a stricter and a few-shot LangChain prompt on the same evaluation set against a Groq-hosted model, then switched the output to JSON.',
  },
  'nf-basics-of-ml': {
    problem: 'Refresh the core scikit-learn workflow: split, fit, evaluate, pick metrics, scale and tune.',
    solution: 'Compared baselines and tuned models on movie revenue and wine quality, then served the tuned gradient-boosting model with FastAPI in Docker, checked in CI.',
  },
  'nf-testing-for-ml': {
    problem: 'Can a machine-learning model be trusted beyond its accuracy score?',
    solution: 'Tested an IMDb sentiment classifier on behaviour, code and data (Great Expectations) and as a FastAPI service, trained by a Prefect + MLflow pipeline.',
  },
  'nf-batch-and-stream-predictions': {
    problem: 'How do you use one trained model for both scheduled batch scoring and live requests?',
    solution: 'Registered a taxi trip-duration model in MLflow and loaded that same model in a monthly Prefect batch flow and in a FastAPI endpoint.',
  },
  'nf-api-ml-deployment': {
    problem: 'How do you make a trained model usable by other programs?',
    solution: 'Registered a taxi-duration model in MLflow under the alias “production” and served it with FastAPI, first with uvicorn, then with MLflow and the API in Docker Compose.',
  },
  'nf-model-deployment-project': {
    problem: 'Predict how long a NYC yellow-taxi trip will take, and serve the model as an API.',
    solution: 'Cleaned January 2025 trips with 9 checked rules, compared six approaches tracked in MLflow, tuned with Optuna and served a HistGradientBoosting model with FastAPI.',
  },
  'nf-github-actions-and-cicd': {
    problem: 'Code tests alone cannot show whether a model change is safe to merge.',
    solution: 'Every pull request runs the unit tests, checks the data version against DVC, trains the XGBoost model and posts its metrics as a comment with CML.',
  },
  // Bootcamp card with no generated journey entry
  'nf-notebook-to-python': {
    problem: 'Feature engineering written in notebook cells is hard to reuse and can leak information from new data into training.',
    solution: 'Moved it into custom scikit-learn transformers and pipelines fitted on training data only, then into importable modules and scripts (Titanic dataset).',
    result: null,
  },

  // ---- Work, research and personal projects (facts from the cards in portfolioData.ts) ------------
  'master-thesis-zanderlink': {
    problem: 'Distributed control systems need deterministic reaction times between PLCs.',
    solution: 'Designed and simulated in VHDL (Xilinx Vivado) a 4-node synchronous serial network, 1 master and 3 slaves, over EIA-485.',
  },
  'rag-lab': {
    problem: 'Answer questions over a 54-section handbook, and measure whether each retrieval change actually helps.',
    solution: 'Structure-aware chunking, Qdrant and pgvector behind one interface, hybrid search with reranking, a 54-question golden-set evaluation, an agent and an MCP server, all in Docker Compose.',
  },
  'bae-assistant': {
    problem: 'An assistant that handles documents, email, calendar and trading data must not misuse or leak them.',
    solution: 'Specialist agents get only the permissions they need, every action is audited, and a deterministic engine, never the LLM, trades a demo account through a risk manager.',
    result: null,
  },
  'job-search-portal': {
    problem: 'Checking dozens of career pages by hand for AI, cloud, DevOps, data and IT roles is slow.',
    solution: 'Scrapers collect openings, the portal ranks them, alerts on new matches and tailors CV and cover-letter drafts to each job with Gemini, with a local LLM as fallback.',
    result: null,
  },
  'docker-portal': {
    problem: 'A web page that controls Docker usually needs access to the Docker socket.',
    solution: 'Only a separate guard service touches the socket and allows just list, inspect, start, stop and restart; the token-protected portal listens on 127.0.0.1 only.',
    result: null,
  },
  'project-deck-generator': {
    problem: 'Every finished project needs a short slide deck with its real results.',
    solution: 'One Python script generates every deck from the project notes, so the layout stays consistent and the numbers come straight from the projects.',
    result: null,
  },
  'industrial-iot-pipeline': {
    problem: 'Recycling machinery across Material Recovery Facilities needed monitoring and fast incident alerts.',
    solution: 'Deployed a Docker stack at WaDaCon that scrapes sensor telemetry into InfluxDB, shows the KPIs in Grafana and sends threshold alerts to MS Teams.',
  },
  'high-availability-load-balancer': {
    problem: 'Industrial telemetry ingestion had single points of failure.',
    solution: 'Active-redundant HAProxy load balancers with Keepalived VRRP virtual-IP failover, NGINX reverse proxies and HTTP health checks.',
  },
  'pedestrian-trajectory': {
    problem: 'Autonomous driving and robotics need to know where pedestrians will move next.',
    solution: 'LSTM-based sequence models learn spatial-temporal patterns from past motion to predict future trajectories.',
    result: null,
  },
  'plant-anomaly-detection': {
    problem: 'Unplanned machinery stoppages in industrial recycling plants.',
    solution: 'ML pipelines analyse vibration, optical-sorter throughput and thermal telemetry to flag equipment degradation.',
  },
  'gemini-flights': {
    problem: 'An AI flight search and booking assistant needed a backend (RadicalX engineering track).',
    solution: 'REST APIs with FastAPI, SQLAlchemy and Swagger docs, built around Google Gemini on Vertex AI.',
    result: null,
  },
  'aeronautical-simulation': {
    problem: 'Explore flight dynamics and aerodynamic principles with computational models.',
    solution: 'Modelled atmospheric drag and control-surface responses under varying flight conditions with Python’s scientific stack.',
    result: null,
  },
  'ml-research-clausthal': {
    problem: 'Compare supervised and deep-learning methods during the MSc in Informatics at TU Clausthal.',
    solution: 'Classification, regression and neural-network experiments with synthetic-data benchmarks and loss-landscape exploration.',
    result: null,
  },
  'ecommerce-kpi-dashboard': {
    problem: 'Netidentity needed to see where customers drop off and how revenue moves across channels.',
    solution: 'Multi-dimensional Power BI dashboards for customer-journey friction, conversion drop-offs and multi-channel revenue KPIs.',
    result: 'Identified checkout friction points.',
  },
};

/** Hand-written bootcamp cards (portfolioData ids) -> their generated journey project. */
const JOURNEY_FOR_CARD = new Map(
  JOURNEY.projects.map((j) => [CURATED_CARD_FOR_FOLDER[j.folder] ?? j.id, j] as const),
);

/** Problem / solution / result for a project card, or null when no copy exists yet. */
export const caseForProject = (p: Pick<Project, 'id' | 'impact'>): Required<ProjectCase> | null => {
  const journey = JOURNEY_FOR_CARD.get(p.id);
  const c = PROJECT_CASES[p.id] ?? (journey ? PROJECT_CASES[journey.id] : undefined);
  if (!c) return null;
  const result = c.result === undefined ? journey?.headline ?? p.impact ?? null : c.result;
  return { problem: c.problem, solution: c.solution, result };
};

/** Same, for a generated journey project. */
export const caseForJourney = (j: { id: string; headline: string }): Required<ProjectCase> | null => {
  const c = PROJECT_CASES[j.id];
  if (!c) return null;
  return { problem: c.problem, solution: c.solution, result: c.result === undefined ? j.headline : c.result };
};
