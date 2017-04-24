import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Card, CardSection, Spinner } from './components/common'; // Actually importing from ./components/common/index.js, but index is automatic
import LoginForm from './components/LoginForm';


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: null,
			loading: false
		};

		// Functions that we pass off to promises that is going to be
		//...evoked at sometime in the future and we don't know tha context
		//...that it will be called with. I used to bind at the beginning, but
		//...now I write pure JavaScript functions
	}


	//Lifecycle method (automattically invoked)
	//.. so, just make it and it will be called.
	componentWillMount() {
		firebase.initializeApp({
			apiKey: 'AIzaSyCSLijD4Z4Gvz-qzobfSStTb9JITTO73-g',
			authDomain: 'auth00-6d122.firebaseapp.com',
			databaseURL: 'https://auth00-6d122.firebaseio.com',
			storageBucket: 'auth00-6d122.appspot.com',
			messagingSenderId: '822221636960'
        });

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({ loggedIn: true });
			} else {
				this.setState({ loggedIn: false });
			}
		});
	}

	signOut = () => {
		this.setState({
			loading: true
		});

		firebase.auth().signOut()
			.then(() => {
				this.setState({
					loading: false
				});
			}
		)
			.catch((error) => {
				this.setState({
					loading: false
				});
				console.log(error);
			});
	}

	renderContent() {
		switch (this.state.loggedIn) {
			case true:
				return (
					<Card>
						<CardSection>
							<Button onPress={this.signOut}>
								Logout
							</Button>
						</CardSection>
					</Card>
				);
			case false:
				return <LoginForm />;
			default:
				return (
					<Card>
						<CardSection>
							<Spinner size="large" />
						</CardSection>
					</Card>
				);
		}
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
				<Header headerText="async_login" />
					{this.renderContent()}
			</View>
		);
	}
}

export default App;
