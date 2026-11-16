
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1 import api_router
from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.inventory.router import router as inventory_router

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    return JSONResponse(
        status_code=422,
        content={
            "message": "Invalid request data.",
            "errors": exc.errors(),
        },
    )


app.include_router(api_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api")
app.include_router(inventory_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Jarvis-002 API is running",
        "environment": settings.app_env,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
