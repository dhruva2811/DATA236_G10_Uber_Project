import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Load dataset
df = pd.read_csv("uber.csv")

# Drop nulls and filter outliers
df = df.dropna()
df = df[(df['fare_amount'] > 0) & (df['fare_amount'] < 100)]

# Feature engineering: calculate distance
def haversine(lat1, lon1, lat2, lon2):
    import numpy as np
    R = 6371  # km
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dphi = np.radians(lat2 - lat1)
    dlambda = np.radians(lon2 - lon1)
    a = np.sin(dphi/2)**2 + np.cos(phi1) * np.cos(phi2) * np.sin(dlambda/2)**2
    return 2 * R * np.arcsin(np.sqrt(a))

df['distance'] = haversine(df['pickup_latitude'], df['pickup_longitude'],
                           df['dropoff_latitude'], df['dropoff_longitude'])

# Extract hour from datetime
df['pickup_datetime'] = pd.to_datetime(df['pickup_datetime'])
df['hour'] = df['pickup_datetime'].dt.hour

# Prepare input/output
X = df[['distance', 'passenger_count', 'hour']]
y = df['fare_amount']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Model pipeline
model = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', RandomForestRegressor(n_estimators=100))
])

model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
import numpy as np
print("✅ RMSE:", np.sqrt(mean_squared_error(y_test, preds)))

# Save model
os.makedirs("ml/models", exist_ok=True)
joblib.dump(model, "ml/models/fare_predictor.pkl")
print("Model saved to ml/models/fare_predictor.pkl")
