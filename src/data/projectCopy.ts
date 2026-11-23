/**
 * Hand-written, recruiter-facing one-line descriptions for the bootcamp projects.
 *
 * journey.generated.json is generated from ~/Projects/project-notes and must not be edited by hand;
 * these overrides only rephrase it. Every fact and number here comes from that file (headline,
 * description, metrics) or the project's notes. When a project is re-run and its numbers change,
 * update or delete its line: a project without an entry falls back to the generated description.
 */
export const PROJECT_COPY: Record<string, string> = {
  'nf-opps':
    'Refactored messy Python into clean functions, classes and validated Pydantic models across 20 exercises, with every notebook checked in CI.',
  'nf-pandas-and-numpy':
    'Cleaned, summarised and plotted real CSV data with pandas and NumPy, ending in an exploratory analysis of 144,015 bike-share trips.',
  'nf-unit-integration-testing':
    'Packaged small Python data pipelines and covered them with pytest unit, data and integration tests: 47 passing, 31 written by me.',
  'nf-docker':
    'Built a typed FastAPI CRUD API on PostgreSQL and shipped the API and database together with Docker Compose.',
  'nf-mle-refactoring-project':
    'Turned a King County house-price notebook into a tested Python package with an API, Docker and CI; one feature step dropped from 400 s to 0.1 s.',
  'nf-model-review-board':
    'A Flask app where an ML team reviews model predictions before another department uses them, deployed on Render with PostgreSQL.',
  'nf-web-service-deployment':
    'Deployed a Dockerised FastAPI server to a Google Cloud VM backed by managed Cloud SQL PostgreSQL 14, scripted with gcloud.',
  'nf-data-pipeline-and-modelling':
    'Loaded 3,475,226 NYC taxi rides (January 2025) into PostgreSQL and remodelled them into a star schema where every table reconciles.',
  'nf-datapipeline-with-dbt':
    'Turned raw NYC taxi rides into tested analytics tables with dbt on Postgres; the full build passes 27/27 in one Docker stack.',
  'nf-workflow-orchestration':
    'Orchestrated Prefect ETL and ELT flows that load NYC taxi data into PostgreSQL and transform it with dbt, all green in CI.',
  'nf-batch-and-stream-processing':
    'Processed 11.2M NYC taxi rides two ways: a daily batch lane into Postgres and dbt, and a live exactly-once stream through Redpanda with 0 duplicates.',
  'nf-data-pipeline-project':
    'Computed daily NYC green-taxi revenue for January to March 2025 ($3.4M) and matched refunds to their charges; runs as a CLI or a Prefect flow.',
  'nf-prompt-engineering':
    'Designed support-triage prompts with LangChain on a Groq-hosted model and compared baseline, stricter and few-shot versions; JSON output parsed 5/5.',
  'nf-basics-of-ml':
    'Worked through core scikit-learn workflows, then tuned a gradient-boosting model to R² 0.908 on movie revenue and served it with FastAPI.',
  'nf-testing-for-ml':
    'Tested a movie-review sentiment model four ways (behaviour, code, data, service) and shipped it as an API with a Prefect + MLflow pipeline.',
  'nf-batch-and-stream-predictions':
    'Registered one taxi trip-duration model in MLflow and used it for both Prefect batch scoring (42,588 predictions) and live FastAPI predictions.',
  'nf-api-ml-deployment':
    'Served an MLflow-registered taxi-duration model (alias "production") through FastAPI, locally and with MLflow and the API in Docker.',
  'nf-model-deployment-project':
    'Compared 6 models for NYC taxi trip duration, improved RMSE from 4.10 to 3.70 min and served the winner with FastAPI in Docker, with data checks and CI.',
  'nf-github-actions-and-cicd':
    'Built CI/CD for an ML model: every pull request runs tests, checks the DVC data version, trains XGBoost and posts the metrics with CML.',
};

export const projectBlurb = (id: string, fallback: string) => PROJECT_COPY[id] ?? fallback;
