import 'bootstrap/dist/css/bootstrap.min.css';
import Navheader from '../components/navheader';

function Onboarding() {
    return (
      
        <div class='form' >
            <div class="card-header" style={{ color:'#FDFFFE'}}>
        <h2>Hi welcome to satha panaha rupiyala</h2>
        </div>
        <form  method="POST" action="https://sandbox.payhere.lk/pay/checkout" id="payhere-checkout-form">
        
          <div class="form-group">
          <label htmlFor="order_id">Order ID:</label>
          <input class="form-control" type="text" id="order_id" name="order_id" value="Order001" /><br />
    </div>

          <div class="form-group">
          <label htmlFor="items">Items Description:</label>
          <input class="form-control" type="text" id="items" name="items" value="Test Product" /><br />
    </div>

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" id="currency" name="currency" value="LKR" /><br />
    </div>

          <div class="form-group">
          <label htmlFor="amount">Amount:</label>
          <input class="form-control" type="text" id="amount" name="amount" value="500" /><br />
    </div>


        </form>
      </div>
    );
  }
  
  export default Onboarding;