from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import HistGradientBoostingClassifier
from lightgbm import LGBMClassifier
from xgboost import XGBClassifier
from feature_engineering import feature_engineering

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "MOIL_manganese_real_combined.csv"
df = pd.read_csv(DATA_PATH)
X = df.drop(columns=["manganese_label"])
y = df["manganese_label"]
X_engineered = feature_engineering(X)

models = {
    "HistGradientBoosting": Pipeline([("imputer", SimpleImputer(strategy="median")), ("model", HistGradientBoostingClassifier(max_iter=300, learning_rate=0.05, max_leaf_nodes=15, l2_regularization=1.0, random_state=42))]),
    "LightGBM": Pipeline([("imputer", SimpleImputer(strategy="median")), ("model", LGBMClassifier(n_estimators=400, learning_rate=0.03, num_leaves=15, min_child_samples=20, subsample=0.85, colsample_bytree=0.9, reg_lambda=1, random_state=42, verbosity=-1, n_jobs=-1))]),
    "XGBoost": Pipeline([("imputer", SimpleImputer(strategy="median")), ("model", XGBClassifier(n_estimators=400, max_depth=4, learning_rate=0.04, subsample=0.85, colsample_bytree=0.9, min_child_weight=3, reg_lambda=1, eval_metric="logloss", random_state=42, n_jobs=-1))])
}
# The notebook computes ensemble weights from 5-fold PR-AUC. Reproduce that here.
from sklearn.model_selection import StratifiedKFold
from sklearn.base import clone
from sklearn.metrics import average_precision_score
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
weights_raw = {}
for name, model in models.items():
    oof = np.zeros(len(y))
    for tr, va in cv.split(X_engineered, y):
        m = clone(model)
        m.fit(X_engineered.iloc[tr], y.iloc[tr])
        oof[va] = m.predict_proba(X_engineered.iloc[va])[:, 1]
    weights_raw[name] = average_precision_score(y, oof)
weights = {k: v / sum(weights_raw.values()) for k, v in weights_raw.items()}
final_models = {}
for name, model in models.items():
    m = clone(model)
    m.fit(X_engineered, y)
    final_models[name] = m
(BASE_DIR / "model").mkdir(exist_ok=True)
joblib.dump(final_models, BASE_DIR / "model" / "manganese_prospectivity_ensemble.pkl")
joblib.dump(weights, BASE_DIR / "model" / "manganese_ensemble_weights.pkl")
print("Saved models:", weights)
