


python3 -m venv venv


if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo downloading for Windows...
    source venv/Scripts/activate  # Windows
else
    echo downloading for Linux...
    source venv/bin/activate  # Linux
fi


pip install -r requirements.txt
=======
python3 -m venv venv

if [[ "$OS" == "Windows_NT" ]]; then
    echo "Downloading for Windows..."
    . venv/Scripts/activate  # Windows
else
    echo "Downloading for Linux..."
    . venv/bin/activate  # Linux/macOS
fi

python -m pip install -r requirements.txt
python -m pip install --upgrade ultralytics torch torchvision torchaudio
