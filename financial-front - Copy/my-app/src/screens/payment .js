import 'bootstrap/dist/css/bootstrap.min.css';
import Navheader from '../components/navheader';

function Payment() {
    return (
      
        <div class='form' >
            <div class="card-header" style={{ color:'#FDFFFE'}}>
        <h2>Test Payment with PayHere</h2>
        </div>
        <form  method="POST" action="https://sandbox.payhere.lk/pay/checkout" id="payhere-checkout-form">
          <input  type="hidden" name="merchant_id" value="1228344" />
          <input type="hidden" name="return_url" value="http://localhost	:8080/payment/success" />
          <input type="hidden" name="cancel_url" value="http://localhost	:8080/payment/cancel" />
          <input type="hidden" name="notify_url" value="http://localhost	:8080/payment/notify" />
    
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


          <p>Customer Details</p><br />
          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="first_name" value="Saman" />
          </div>
          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control"type="text" name="last_name" value="Perera" />
</div>
          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="email" value="samanp@gmail.com" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="phone" value="0771234567" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="address" value="No.1, Galle Road" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          
         
          <input class="form-control" type="hidden" name="country" value="Sri Lanka" />
        

         
         
          <input class="form-control" type="hidden" name="hash" value="F0827056154DCFB4B1BE0BA98BCBE7C9" />    
          

          <input type="submit" value="Buy Now" style={{background:"#1B5C4A"}}/>
        </form>
      </div>
    );
  }
  
  export default Payment;