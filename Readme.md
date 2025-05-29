Here's the `README.md`

---

```markdown
# 📊 Financial AI Project - Setup Guide

This guide walks you through setting up environments and running different components of the project using `requirements.txt` files and relative paths.

---

## 🔹 ML_FYP

1. **Navigate to**:
```

FINAL\_CLONE - Copy - Copy (3)/ML\_FYP

````

2. **Create and activate virtual environment**:

```bash
python -m venv env
.\env\Scripts\activate
````

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run** (in the same folder):

   ```bash
   .\activate.bat
   ```

---

## 🔹 stockAI Environment (Main)

1. **Navigate to**:

   ```
   FINAL_CLONE - Copy - Copy (3)/stockAI
   ```

2. **Create and activate virtual environment**:

   ```bash
   python -m venv env
   .\env\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run Spark streaming pipeline**:

   ```bash
   cd data-pipeline/main-pipeline
   python spark_stream.py
   ```

5. **Run machine learning models**:

   * For training:

     ```bash
     cd ../../ml-algorithms
     python regression.py
     ```

   * For live implementation:

     ```bash
     python ml_impl.py
     ```

---

## 🔹 Scraper Pipeline Environment

1. **Navigate to**:

   ```
   FINAL_CLONE - Copy - Copy (3)/stockAI/data-pipeline/scraper
   ```

2. **Create and activate virtual environment**:

   ```bash
   python -m venv env
   .\env\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run scraper main script**:

   ```bash
   python main.py
   ```

---

## 🔹 AdviceAI Model Environment

1. **Navigate to**:

   ```
   FINAL_CLONE - Copy - Copy (3)/web scraper - Copy
   ```

2. **Create and activate virtual environment**:

   ```bash
   python -m venv env
   .\env\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run model scripts**:

   Navigate to:

   ```
   AdviceAI/Advices/adviceProvider
   ```

   Run:

   ```bash
   python forecast.py
   python sentimentAI.py
   python invAI2.py
   python savingsAD.py
   python Llama.py
   ```

5. **Run user clustering**:

   Navigate to:

   ```
   AdviceAI/UserClustering
   ```

   Run:

   ```bash
   python clustering.py
   ```

---

## 🔹 Advice Models - Deployment Note

1. **Navigate to**:

   ```
   FINAL_CLONE - Copy - Copy (3)/Advice models - Copy
   ```

2. **Create and activate virtual environment**:

   ```bash
   python -m venv env
   .\env\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run deployed model**:

   ```bash
   python savAD_impl.py
   ```

> ⚠️ These models are **hosted services**, so there's **no need to run them locally** unless you're debugging or developing further.

---

## 🔹 Frontend Setup (React App)

1. **Navigate to**:

   ```
   FINAL_CLONE - Copy - Copy (3)/financial-front - Copy/my-app
   ```

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

---

## ✅ Notes

* Always activate the appropriate virtual environment before running scripts.
* Make sure Python, pip, and Node.js are correctly installed and added to your system PATH.
* Use `deactivate` to exit a virtual environment when done.

```

---

Let me know if you'd like me to save this as a downloadable `README.md` file or generate a project structure tree as well.
```
## Backend is in java-budgetcontrol folder. (open and run in intellij or suitable java IDE)