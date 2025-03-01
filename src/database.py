
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import *
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)  # Enable CORS for the entire app (or specific routes)


class ServiceLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    hours = db.Column(db.String(1180))
    date = db.Column(db.String(20))
    description = db.Column(db.String(255))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(80), unique=True, nullable=False)
    zipcode = db.Column(db.String(80), unique=True, nullable=False)
    hoursNeeded = db.Column(db.String(80), unique=True, nullable=False)
    previous = db.Column(db.JSON, unique=True, default=[])


def create_user():
    with app.app_context():
        db.drop_all()
        db.create_all()
        username = input('Enter your username: ')
        password = input('Enter your password: ')
        name = input('Enter your name: ')
        zipcode = input('Enter your zipcode: ')
        hoursNeeded = input('Enter your hours needed: ')
        previous = []
        ans = input(
            'What previous opportunities have you done in the past (if none or finished type done): ')
        while ans != "done":
            previous.append(ans)
            ans = input('Any more oppurtunities to add: ')

        new_user = User(username=username, password=password,
                        name=name, zipcode=zipcode, hoursNeeded=hoursNeeded, previous=previous)

        db.session.add(new_user)
        db.session.commit()
        users = db.session.query(User).all()
    for user in users:
        print(user.name, user.zipcode, user.hoursNeeded, user.previous)


def create_service_log():
    with app.app_context():
        db.drop_all()
        db.create_all()
        name = input('Enter your name: ')
        hours = input('Enter your hours: ')
        date = input('Enter your date: ')
        description = input('Enter your decription: ')

        new_log = ServiceLog(name=name, hours=hours,
                             date=date, description=description)

        db.session.add(new_log)
        db.session.commit()
        logs = db.session.query(ServiceLog).all()


@app.route('/log', methods=['POST'])
# def log():
def index():
    return render_template('index.html')


@app.route('/log_hours', methods=['POST'])  # Changed route name
def log_hours():
    data = request.json
    new_entry = ServiceLog(
        name=data['name'],
        hours=data['hours'],
        date=data['date'],  # Access date from data
        description=data['description']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Hours logged successfully"})


@app.route('/logs', methods=['GET'])
def get_logs():
    logs = ServiceLog.query.all()
    return jsonify([{
        "id": log.id,
        "name": log.name,
        "hours": log.hours,
        "date": log.date,
        "description": log.description
    } for log in logs])


def export_logs_to_pdf():
    # Query all service logs from the database
    with app.app_context():  # Ensure you're within the app context
        logs = ServiceLog.query.all()

    # Create a BytesIO buffer to store the PDF in memory
    buffer = BytesIO()

    # Set up the canvas for the PDF (letter size)
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setTitle("Service Hours Log")

    # Set up the title
    c.setFont("Helvetica-Bold", 14)
    c.drawString(220, 750, "Service Hours Log")

    # Set up table header
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 720, "Event")
    c.drawString(200, 720, "Date")
    c.drawString(350, 720, "Hours")
    c.drawString(500, 720, "Description")

    # Set font for the table content
    c.setFont("Helvetica", 10)

    # Starting Y position for rows
    y_position = 700

    # Loop through the logs and add them to the PDF
    for log in logs:
        if y_position < 100:  # If we reach the bottom of the page, create a new page
            c.showPage()
            c.setFont("Helvetica-Bold", 10)
            c.drawString(50, 720, "Event")
            c.drawString(200, 720, "Date")
            c.drawString(350, 720, "Hours")
            c.drawString(500, 720, "Description")
            y_position = 700

        c.drawString(50, y_position, log.name)
        c.drawString(200, y_position, log.date)
        c.drawString(350, y_position, str(log.hours))
        c.drawString(500, y_position, log.description)  # Empty for signature

        y_position -= 20  # Move down for the next row

    # Save the PDF to the buffer
    c.save()

    # Seek to the beginning of the BytesIO buffer
    buffer.seek(0)

    return buffer


def save_pdf():
    buffer = export_logs_to_pdf()  # Get the PDF content as a BytesIO buffer

    # Save the PDF to a file
    with open("service_logs.pdf", "wb") as f:
        f.write(buffer.getvalue())


"""
def opp_finder():


    with app.app_context():  # Ensure you're within the app context
        users = User.query.all()
    zipcode = ""
    for user in users:
        zipcode = user.zipcode
    print(zipcode)
    url = f"https://www.volunteermatch.org/search/?l={zipcode}"
    print(url)
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    results = soup.find_all('div', class_='search-result')
    print(results)
    for result in results:
        title = result.find('h3')
        location = result.find('p', class_='location')
        print(f"Title: {title.text.strip()}")
        print(f"Location: {location.text.strip()}")
        print("------")

    soup = BeautifulSoup(response.text, 'html.parser')
"""


def scrapy_opp_finder():
    pass  # added pass to prevent error


def main():
    create_service_log()
    save_pdf()

    #create_user()
    # opp_finder()


if __name__ == '__main__':
    main()

