import Layout from '../components/Layout'
import Paper from '../components/Paper'

export default function SuccessPage() {
  return (
    <Layout pageTitle='successful login!'>
      <Paper rounded shadow>
        <h1>Yay! successfull login!</h1>
      </Paper>
    </Layout>
  )
}
