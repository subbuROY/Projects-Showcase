import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apStatus = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

// Replace your code here
class App extends Component {
  state = {projectDetails: [], selected: 'ALL', ap: apStatus.initial}

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    this.setState({ap: apStatus.loading})
    const {selected} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selected}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const formattedData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({projectDetails: formattedData, ap: apStatus.success})
    } else {
      this.setState({ap: apStatus.fail})
    }
  }

  onChangeSelect = event => {
    this.setState({selected: event.target.value}, this.getProjectDetails)
  }

  loadingView = () => (
    <div data-testid="loader" className="loading">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {projectDetails} = this.state
    return (
      <ul className="project-list">
        {projectDetails.map(each => (
          <li key={each.id} className="list-items">
            <img src={each.imageUrl} alt={each.name} className="image" />
            <p className="name">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  failureView = () => (
    <div className="fail-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="fail-img"
        alt="failure view"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getProjectDetails}>
        Retry
      </button>
    </div>
  )

  renderProjectDetailsView = () => {
    const {ap} = this.state
    switch (ap) {
      case apStatus.loading:
        return this.loadingView()
      case apStatus.success:
        return this.successView()
      case apStatus.fail:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {selected} = this.state
    return (
      <div className="bg-container">
        <div className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="projects-container">
          <select
            className="select"
            value={selected}
            onChange={this.onChangeSelect}
          >
            {categoriesList.map(each => (
              <option className="options" value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>

          {this.renderProjectDetailsView()}
        </div>
      </div>
    )
  }
}

export default App
