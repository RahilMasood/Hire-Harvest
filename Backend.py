from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from forms import LeaseForm
from datetime import datetime
import os

#renter detail page
from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, TextAreaField, IntegerField, FileField
from wtforms.validators import DataRequired, NumberRange
from flask_wtf.file import FileAllowed, FileRequired





#Login Page
app = Flask(__name__)

# In-memory user storage for demonstration purposes
users = {}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username in users and users[username] == password:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username in users:
        return jsonify({'message': 'User already exists'}), 409
    else:
        users[username] = password
        return jsonify({'message': 'User created successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)













#Home Page
tools = [
    {"id": 1, "name": "Mahindra 475 Di", "price": 300, "rating": 4.5, "photo": "pic1.jpg"},
    {"id": 2, "name": "John Deere", "price": 200, "rating": 4.8, "photo": "pic2.jpg"},
    {"id": 3, "name": "Massey Ferguson 241 Dynatrack", "price": 400, "rating": 4.6, "photo": "pic3.jpg"}
]

@app.route('/')
def home():
    return render_template('index.html', tools=tools)

@app.route('/search')
def search():
    query = request.args.get('q', '')
    filtered_tools = [tool for tool in tools if query.lower() in tool['name'].lower()]
    return jsonify(filtered_tools)

@app.route('/book/<int:tool_id>', methods=['POST'])
def book_tool(tool_id):
    tool = next((tool for tool in tools if tool['id'] == tool_id), None)
    if tool:
        return jsonify({"message": f"{tool['name']} has been booked!"}), 200
    else:
        return jsonify({"message": "Tool not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)










#Renter Detail Page
app.secret_key = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Sample data
tools = [
    {"id": 1, "name": "Mahindra 475 Di"},
    {"id": 2, "name": "John Deere"},
    {"id": 3, "name": "Massey Ferguson 241 Dynatrack"}
]

models = [
    {"id": 1, "name": "Model A"},
    {"id": 2, "name": "Model B"},
    {"id": 3, "name": "Model C"}
]

@app.route('/', methods=['GET', 'POST'])
def lease():
    form = LeaseForm()
    form.tool.choices = [(tool['id'], tool['name']) for tool in tools]
    form.model.choices = [(model['id'], model['name']) for model in models]
    
    if form.validate_on_submit():
        tool = form.tool.data
        model = form.model.data
        specifications = form.specifications.data
        tariff = form.tariff.data
        image = form.image.data
        
        if image:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
            image.save(image_path)
        
        # Process the data (e.g., save to a database)
        
        flash('Details submitted successfully!', 'success')
        return redirect(url_for('lease'))

    return render_template('lease.html', form=form)

if __name__ == '__main__':
    if not os.path.exists('static/uploads'):
        os.makedirs('static/uploads')
    app.run(debug=True)



class LeaseForm(FlaskForm):
    tool = SelectField('What do you want to lease?', validators=[DataRequired()])
    model = SelectField('Which Model?', validators=[DataRequired()])
    specifications = TextAreaField('Any specifications', validators=[DataRequired()])
    tariff = IntegerField('Tariff per hour', validators=[DataRequired(), NumberRange(min=1, message="Must be a positive number")])
    image = FileField('Upload image', validators=[FileRequired(), FileAllowed(['jpg', 'png'], 'Images only!')])












#Confirmation Page
app.secret_key = 'supersecretkey'

# Sample product data
product = {
    "model_no": "Mahindra 475 Di",
    "tariff_per_hour": 300
}

@app.route('/', methods=['GET', 'POST'])
def confirmation():
    if request.method == 'POST':
        from_time = request.form.get('from_time')
        to_time = request.form.get('to_time')
        note = request.form.get('note')
        
        # Process the data (e.g., save to a database)
        flash('Rental confirmed!', 'success')
        return redirect(url_for('confirmation'))

    return render_template('confirmation.html', product=product)

if __name__ == '__main__':
    app.run(debug=True)
