import numpy as np
import pandas as pd

def feature_engineering(data: pd.DataFrame) -> pd.DataFrame:
    data = data.copy()
    eps = 1e-6
    data["NIR_RED_ratio"] = data["B08"] / (data["B04"] + eps)
    data["SWIR1_SWIR2_ratio"] = data["B11"] / (data["B12"] + eps)
    data["BLUE_RED_ratio"] = data["B02"] / (data["B04"] + eps)
    data["NIR_RED_diff"] = data["B08"] - data["B04"]
    data["SWIR_difference"] = data["B11"] - data["B12"]
    data["BLUE_RED_diff"] = data["B02"] - data["B04"]
    data["SWIR_mean"] = (data["B11"] + data["B12"]) / 2
    data["VIS_mean"] = (data["B02"] + data["B03"] + data["B04"]) / 3
    data["spectral_mean"] = (data["B02"] + data["B03"] + data["B04"] + data["B08"] + data["B11"] + data["B12"]) / 6
    data["terrain_complexity"] = data["slope_deg"] * data["terrain_relief_m"]
    data["elev_relief_ratio"] = data["elevation_m"] / (data["terrain_relief_m"] + eps)
    if "cloud_cover" in data.columns:
        data = data.drop(columns=["cloud_cover"])
    data = data.replace([np.inf, -np.inf], np.nan)
    return data
