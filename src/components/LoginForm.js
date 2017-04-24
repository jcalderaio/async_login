/* @flow */

import React, { Component } from 'react';
import { Text, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { Button, Card, CardSection, Input, Spinner } from './common';

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			message: '',
			color: '',
			loadingSignIn: false,
			loadingSignUp: false
		};

		// Functions that we pass off to promises that is going to be
		//...evoked at sometime in the future and we don't know tha context
		//...that it will be called with.
	}

	componentWillMount() {
		this.loadFromStorage('user');
		console.log('first?');
	}

	//Dynamically changes the style of the "this.state.message" text below
	getMessageStyle() {
		return {
			fontSize: 20,
			color: this.state.color,
			alignSelf: 'center'
		};
	}

	saveToStorage = async (key, value) => {
		try {
			await AsyncStorage.setItem(key, value);
		} catch (error) {
			console.log(error);
		}
	}

	loadFromStorage = async (key) => {
		try {
			await AsyncStorage.getItem(key).then((value) => {
				if (value !== null) {
					this.setState({ email: value });
					console.log(value);
				}
			}).done();
		} catch (error) {
			console.log(error);
		}
	}

	signIn = () => {
		const { email, password } = this.state;	//refactors out the user and pass out of state

		this.setState({
			message: '', //resets the message to clear
			loadingSignIn: true
		});

		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => {		//If user found, sign them in
				// On successful login, store the username in async storage
				this.saveToStorage('user', email).done();
				// Clear email, password, make message color green, and no loading
				this.setState({
					email: '',
					password: '',
					color: 'green',
					message: 'User Signed In',
					loadingSignIn: false
				});
			})
			.catch((error) => {		//If user not found
				this.setState({
					color: 'red',
					message: `${error}`,  // Error is very detailed
					loadingSignIn: false
				});
			});
	}

	signUp = () => {
		const { email, password } = this.state;

		this.setState({
			message: '',
			loadingSignUp: true
		});

		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(() => {		//Sign Up a user successfully
				// On successful login, store the username in async storage
				this.saveToStorage('user', email).done();
				this.setState({
					email: '',
					password: '',
					color: 'green',
					message: 'User created! Please log in.',
					loadingSignUp: false
				});
			})
			.catch((error) => {		//Sign Up failed for some reason
				this.setState({
					color: 'red',
					message: `${error}`,
					loadingSignUp: false
				});
			});
	}
	// value={this.state.email} // *It works if I leave this out.
	render() {
		return (
			<Card>

				<CardSection>
					<Input
						defaultValue={this.state.email}
						value={this.state.email}
						onChangeText={email => this.setState({ email })}
						label='Email'
						placeholder='user@gmail.com'
					/>
				</CardSection>

				<CardSection>
					<Input
						secureTextEntry
						value={this.state.password}
						onChangeText={password => this.setState({ password })}
						label='Password'
						placeholder='password'
					/>
				</CardSection>

				<Text style={this.getMessageStyle()}>{this.state.message}</Text>

				<CardSection>
					{/* If Sign in pressed, then show a loading screen*/}
					{this.state.loadingSignIn && <Spinner size='small' />}
					{/* If NOT pressed, then show a login Button*/}
					{(!this.state.loadingSignIn) &&
						<Button onPress={this.signIn}>
							Login
						</Button>
					}
				</CardSection>

				<CardSection>
					{/* If Sign up pressed, then show a loading screen*/}
					{this.state.loadingSignUp && <Spinner size='small' />}
					{/* If NOT pressed, show the login button */}
					{(!this.state.loadingSignUp) &&
						<Button onPress={this.signUp}>
							Sign Up
						</Button>
					}
				</CardSection>

			</Card>
		);
	}
}

export default LoginForm;
