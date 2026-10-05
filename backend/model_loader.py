"""Loads the trained sklearn pipeline once at startup and exposes it.

The model was trained with scikit-learn 1.6.1.  Running on a newer version
requires a few compatibility shims for private classes that were
removed or renamed.  The shims are injected **before** joblib.load() so
that pickle can resolve every class reference.
"""

import logging
import warnings
from pathlib import Path

import joblib

from config import MODEL_PATH

logger = logging.getLogger(__name__)

# Module-level singleton
_pipeline = None


# ─── Compatibility shims for sklearn 1.6.1 → 1.9.x ─────────────────────────

def _apply_compat_shims():
    """Monkey-patch missing private symbols so that the 1.6.1 pickle loads."""
    import sklearn.compose._column_transformer as ct_mod

    # _RemainderColsList was a thin list subclass used internally.
    # It was removed after 1.6.x; a plain list works as a drop-in.
    if not hasattr(ct_mod, "_RemainderColsList"):
        class _RemainderColsList(list):
            """Compatibility stub for sklearn ≤ 1.6."""

            def get_indexer(self, *args, **kwargs):
                import numpy as np
                return np.arange(len(self))

        ct_mod._RemainderColsList = _RemainderColsList
        logger.debug("Injected _RemainderColsList shim into sklearn.compose._column_transformer")


# ─── Public API ──────────────────────────────────────────────────────────────

def load_model():
    """Load the sklearn pipeline from disk.  Called once at application startup."""
    global _pipeline

    model_path = Path(MODEL_PATH)
    if not model_path.exists():
        raise FileNotFoundError(
            f"Model file not found at {model_path}. "
            "Set the MODEL_PATH environment variable to the correct path."
        )

    logger.info("Loading model from %s …", model_path)

    # Apply shims before unpickling
    _apply_compat_shims()

    # Suppress sklearn version-mismatch warnings (model was trained on 1.6.1)
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=UserWarning)
        _pipeline = joblib.load(model_path)

    logger.info("Model loaded successfully: %s", type(_pipeline).__name__)
    return _pipeline


def get_model():
    """Return the loaded pipeline.  Raises if the model was never loaded."""
    if _pipeline is None:
        raise RuntimeError("Model has not been loaded. Call load_model() first.")
    return _pipeline


def is_model_loaded() -> bool:
    """Check whether the model is currently available."""
    return _pipeline is not None
