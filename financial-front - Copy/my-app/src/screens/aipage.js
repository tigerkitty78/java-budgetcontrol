import 'bootstrap/dist/css/bootstrap.min.css';



function AIpage() {

  return (

    <div className="App">
     <div class='form' style={{borderRadius:"40PX"}} >
        <div class="card-header" style={{ color:'#FDFFFE', backgroundColor:"#1B5C4A", margin:"0px"}}>
        <h2>Test Payment with PayHere</h2>
        </div>
        <form  method="POST" action="https://sandbox.payhere.lk/pay/checkout" id="payhere-checkout-form">

          <div class="form-group">
          <label htmlFor="currency">Monthly salary </label>
          <input class="form-control" type="text" name="first_name" value="Saman" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Mandatory expenses</label>
          <input class="form-control"type="text" name="last_name" value="Perera" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Monthly non Mandatory expenses</label>
          <input class="form-control" type="text" name="email" value="samanp@gmail.com" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Total monthly Income</label>
          <input class="form-control" type="text" name="phone" value="0771234567" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">monthly salary</label>
          <input class="form-control" type="text" name="address" value="No.1, Galle Road" />
          </div>
          <div class="form-group">
          <label htmlFor="currency">monthly investments</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">debts</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">monthly investments</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">debts</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">age</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">family status</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">risk tolerance</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>


          <div class="form-group">
          <label htmlFor="currency">risk tolerance</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">emergency</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">emergency fund</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>


          <div class="form-group">
          <label htmlFor="currency">financial goals</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>


          <div class="form-group">
          <label htmlFor="currency">people income spent on</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>


          <input class="form-control" type="hidden" name="country" value="Sri Lanka" />
          <input class="form-control" type="hidden" name="hash" value="F0827056154DCFB4B1BE0BA98BCBE7C9" />    
          <input type="submit" value="Buy Now" style={{background:"#1B5C4A"}}/>
        </form>
      </div>
    </div>

  );
}

export default AIpage;
