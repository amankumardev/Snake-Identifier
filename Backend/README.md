# SnakeClassifier FastAPI Backend

FastAPI backend for the React frontend.

## Install

```powershell
cd "C:\coding\SnakeClassifier-main\Back End"
python -m pip install -r requirements.txt
```

## Run

```powershell
cd "C:\coding\SnakeClassifier-main\Back End"
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

API:

- `GET /api/health`
- `POST /api/predict/image` with multipart form field `file`
- `POST /api/predict/video` with multipart form field `file`
- `POST /api/predict` auto-routes by file type

If `Back End/model/snake_model.pth` exists, the backend tries to load it using the notebook checkpoint format:

```python
torch.save({
    "model_state_dict": model.state_dict(),
    "class_names": class_names
}, "snake_model.pth")
```

Without the model file, it returns a deterministic demo result so the website can still run end to end.
