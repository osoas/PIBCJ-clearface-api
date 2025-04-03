


python3 -m venv venv


if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo downloading for Windows...
    source venv/Scripts/activate  # Windows
else
    echo downloading for Linux...
    source venv/bin/activate  # Linux
fi


pip install -r requirements.txt
