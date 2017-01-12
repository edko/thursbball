angular.module('myModule.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('about','<md-toolbar layout="row" class="md-hue-3"><div class="md-toolbar-tools"><span>About</span></div></md-toolbar><md-content layout-padding=""><p>Welcome to the ThursBball app. We play every Thursday night from 10pm until 12am in a college regulation gym located in South El Monte.</p><p>The maximum number of players per evening is 16, or 8 per team. This simple app was created to manage the roster of players for each night.</p><p>Thanks for signing up and hope to see you on our next ThursBball night.</p><p>- Ed</p></md-content>');
$templateCache.put('ballnightdetail','<section class="md-hue-3"><md-subheader class="md-primary">Details for {{ date | date: \'M/dd/yyyy\'}}</md-subheader><ol><li ng-repeat="player in players" style="font-size:14px;"><i class="mdi mdi-check-circle-outline mdi-18px mdi-dark" style="color:green;"></i> <span ng-if="player.email==currentUser.email" style="font-weight: bold; color: green;">{{ player.first_name}} {{ player.last_name}} - {{ player.date | date:\'MM/dd/yyyy @ h:mma\' }}</span> <span ng-if="player.email!=currentUser.email">{{ player.first_name}} {{ player.last_name}} - {{ player.date | date:\'MM/dd/yyyy @ h:mma\' }}</span></li><li ng-repeat="wait in waitlist" style="font-size:14px;"><i class="mdi mdi-alert-circle-outline mdi-18px mdi-dark" style="color:red;"></i> <span ng-if="wait.email==currentUser.email" style="font-weight: bold; color: red;">{{ wait.first_name}} {{ wait.last_name}} - {{ wait.date | date:\'MM/dd/yyyy @ h:mma\' }}</span> <span ng-if="wait.email!=currentUser.email">{{ wait.first_name}} {{ wait.last_name}} - {{ wait.date | date:\'MM/dd/yyyy @ h:mma\' }}</span></li></ol></section>');
$templateCache.put('ballnights','<md-toolbar layout="row" class="md-hue-3"><div class="md-toolbar-tools"><span>ADMIN: Manage Bball Nights</span></div></md-toolbar><div layout="row" layout-align="center top"><div flex="30" flex-lg="30" flex-gt-md="30" flex-md="30" flex-sm="40" flex-xs="70"><form name="bballnightForm" layout="column" novalidate=""><md-input-container><label>Enter date</label><md-datepicker ng-model="bballdate" ng-required="true"></md-datepicker></md-input-container><md-input-container><md-button class="md-primary" type="submit" ng-click="addBballNight()" ng-disabled="bballnightForm.$invalid">Add New Date</md-button></md-input-container></form><md-list-item class="secondary-button-padding" ng-repeat="(key,ballnight) in ballnights"><p>{{ ballnight.bball_date | date: \'M/dd/yyyy\' }} {{ ballnight.counter }}/{{ ballnight.waitlistcounter }}</p><md-button class="md-secondary" ng-click="deleteBballNight(key)" ng-disabled="true">Delete</md-button></md-list-item></div></div>');
$templateCache.put('contact','<md-toolbar layout="row" class="md-hue-3"><div class="md-toolbar-tools"><span>Contact</span></div></md-toolbar>');
$templateCache.put('dashboard-2','<md-card ng-repeat="ballnight in ballnights"><md-card-header><md-card-header-text><player-status data="ballnight"></player-status>{{ ballnight.bball_date | date: \'EEE M/dd/yyyy\' }}</md-card-header-text></md-card-header><md-card-actions layout="row" layout-align="start center"><md-card-icon-actions><md-button class="md-icon-button md-primary" ng-click="checkin(ballnight)" ng-disabled="ballnight.counter > 15" aria-label="add me"><i class="mdi mdi-account-plus mdi-24px"></i></md-button><md-button class="md-icon-button md-primary" ng-click="checkout(ballnight)" aria-label="remove me"><i class="mdi mdi-account-remove mdi-24px"></i></md-button><md-button class="md-icon-button md-primary" ng-click="waitlist(ballnight)" ng-show="ballnight.counter>15" aria-label="waitlist"><i class="mdi mdi-account-remove mdi-24px"></i></md-button><md-button class="md-icon-button md-primary" ng-click="removewaitlist(ballnight)" ng-show="ballnight.counter>15" aria-label="remove waitlist"><i class="mdi mdi-account-remove mdi-24px"></i></md-button></md-card-icon-actions></md-card-actions><md-card-content><md-button ng-click="showroster=true">Roster ({{ ballnight.counter }})</md-button><md-button ng-click="showroster=false">Waitlist ({{ ballnight.waitlistcounter }})</md-button><div ng-show="showroster"><players data="ballnight"></players></div><div ng-show="!showroster"><waitlist data="ballnight"></waitlist></div></md-card-content></md-card>');
$templateCache.put('dashboard','<section><md-subheader class="md-primary"><div layout="row" layout-align="end center"><div>{{ title}}</div><div flex=""></div><div><i class="mdi mdi-check-circle-outline mdi-18px mdi-dark" style="color:green;"></i> <span class="bb-small">= In</span> <i class="mdi mdi-alert-circle-outline mdi-18px mdi-dark" style="color:red;"></i> <span class="bb-small">= Waitlist</span></div></div></md-subheader><md-content layout-wrap="" style="height: 40vh"><md-list-item ng-repeat="ballnight in ballnights" ng-click="go(ballnight.bball_date)"><div class="md-list-item-text"><player-status data="ballnight"></player-status>{{ ballnight.bball_date | date: \'M/dd/yyyy\' }} <span style="font-size: 11px; padding-bottom: 10px;"><roster-count data="ballnight"></roster-count><waitlist-count data="ballnight"></waitlist-count></span></div><span flex=""></span> <span ng-if="ballnight.counter==16" style="font-weight:bold;color:red;">FULL</span> <span ng-if="ballnight.counter<16">+{{ 16 - ballnight.counter}}</span><md-menu md-position-mode="target-right target"><md-button class="md-icon-button" ng-click="$mdOpenMenu($event)" aria-label="actions"><md-icon class="mdi mdi-dots-vertical mdi-24px"></md-icon></md-button><md-menu-content width="4"><md-menu-item><md-button class="md-button" ng-click="checkin(ballnight)" ng-disabled="ballnight.counter > 15" aria-label="add me"><md-icon class="mdi mdi-check-circle-outline mdi-24px mdi-dark bb-mdi-fix"></md-icon>Add me</md-button></md-menu-item><md-menu-item><md-button ng-click="checkout(ballnight.bball_date, $event)"><md-icon class="mdi mdi-close-circle-outline mdi-24px mdi-dark bb-mdi-fix"></md-icon>Remove me</md-button></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item ng-if="ballnight.counter > 15"><md-button ng-click="waitlist(ballnight)" aria-label="waitlist"><md-icon class="mdi mdi-alert-circle-outline mdi-24px mdi-dark bb-mdi-fix"></md-icon>Waitlist me</md-button></md-menu-item><md-menu-item ng-if="ballnight.counter>15"><md-button ng-click="removewaitlist(ballnight)" aria-label="remove waitlist"><md-icon class="mdi mdi-close-circle-outline mdi-24px mdi-dark bb-mdi-fix"></md-icon>Remove waitlist</md-button></md-menu-item></md-menu-content></md-menu><md-divider></md-divider></md-list-item></md-content></section><md-content ui-view="detail" style="height:45vh; border-top: 1px solid #cccccc;"></md-content>');
$templateCache.put('faq','<md-toolbar layout="row" class="md-hue-3"><div class="md-toolbar-tools"><span>FAQ</span></div></md-toolbar><md-content layout-padding=""><md-list><md-list-item class="md-3-line"><div class="md-list-item-text"><h3>Where is Thursday basketball?</h3><p>The gym is located at 1827 Floradale Ave, South El Monte, CA.</p></div><md-divider></md-divider></md-list-item><md-list-item class="md-3-line"><div class="md-list-item-text"><h3>How is the gym time structured?</h3><p>We try to divide into 2 evenly matched teams and play 2 games of 40 minutes. We take a 2-3 minute break between halves and games. If there are more than 5 players per team, we employ mandatory substitution every 5 minutes using our sub-rotation sheet. Warm up is from 10-10:15pm, and first game starts around 10:20pm.</p></div><md-divider></md-divider></md-list-item><md-list-item class="md-2-line"><div class="md-list-item-text"><h3>Why max number of players each night?</h3><p>There is a cap of 16 players each night due to our limitation of 1 court and 2 hours timeframe. We have mandatory sub-rotation to make sure that every player has equal minutes playing in the game every time.</p></div><md-divider></md-divider></md-list-item><md-list-item class="md-2-line"><div class="md-list-item-text"><h3>How does waitlist work?</h3><p>If there is already 16 for the night, that night is full. You will need to add yourself to the waitlist in this app so that the system can automatically add you to the roster if someone drops out. This app will handle that for you so that you don\'t need to keep checking. Adding waitlist to the roster is based on priority, or whoever signed up to the waitlist first.</p></div><md-divider></md-divider></md-list-item><md-list-item class="md-2-line"><div class="md-list-item-text"><h3>Is Thursday basketball open to anybody?</h3><p>Right now it\'s a closed, by invite only.</p></div><md-divider></md-divider></md-list-item><md-list-item class="md-2-line"><div class="md-list-item-text"><h3>Can I bring guests to play and will they have to pay?</h3><p>If there is space available, or less than 16 for that night, you can bring guests to play. However, priority are for those who have prepaid and/or registered.</p></div><md-divider></md-divider></md-list-item><md-list-item class="md-2-line"><div class="md-list-item-text"><h3>Will I be notified if I was moved from the waitlist to the roster?</h3><p>At this time, you will receive an email confirmation on the day of the game that you are in the roster. Automatic SMS/TEXT message feature to alert you instantly is being added very soon.</p></div><md-divider></md-divider></md-list-item><md-list-item class="md-2-line"><div class="md-list-item-text"><h3>What are the gym fees and who/how do I pay?</h3><p>The cost is $10/per night. You can pay each time you come to the gym. However, if you sign up for more than 8 out of 12 nights, please pay in full. Payment forms can be by cash, check, or paypal.</p></div><md-divider></md-divider></md-list-item></md-list></md-content>');
$templateCache.put('footer','<h2>footer</h2>');
$templateCache.put('header','<md-toolbar class="md-hue-2"><div class="md-toolbar-tools"><span flex=""></span> <a ng-href="#/dashboard"><img ng-src="images/header-logo.png"></a> <span flex=""></span><md-button class="md-icon-button md-primary" aria-label="Home" ng-click="openSidebar()"><md-icon class="mdi mdi-menu mdi-24px"></md-icon></md-button></div></md-toolbar>');
$templateCache.put('login','<div layout="row" layout-align="center center" class="container"><div flex="30" flex-lg="30" flex-gt-md="30" flex-md="30" flex-sm="40" flex-xs="70"><div layout="column" layout-align="center center"><div style="margin-bottom: 50px;"><img src="images/logo.png" flex="100"></div></div><div>{{ message }}<form name="loginForm" ng-submit="login()" layout="column" novalidate=""><md-input-container class="md-block"><label>Email</label> <input ng-model="user.email" type="email" ng-required="true"></md-input-container><md-input-container class="md-block"><label>Password</label> <input ng-model="user.password" type="password" ng-required="true"></md-input-container><div layout="row"><md-button class="md-raised md-primary" type="submit" ng-disabled="loginForm.$invalid" flex="100">Login</md-button></div><div layout="row"><md-button class="md-primary" ng-href="#/register" flex="50">Sign Up</md-button><md-button ng-href="#/resetpassword" flex="50">Reset Password</md-button></div></form></div></div></div>');
$templateCache.put('myprofile','<md-toolbar layout="row" class="md-hue-3"><div class="md-toolbar-tools"><span>My Profile</span></div></md-toolbar><div ng-cloak=""><md-content><md-tabs md-dynamic-height="" md-border-bottom="" md-center-tabs="true"><md-tab label="My Nights"><md-content class="md-padding"><div layout="row" layout-align="center top" class="container"><md-content layout-padding=""><ul style="list-style: none;">In the roster:<li ng-repeat="night in myballnights"><i class="mdi mdi-check-circle-outline mdi-18px mdi-dark" style="color:green;"></i> {{ night.date | date: \'EEEE M/dd/yyyy\' }}</li></ul><ul style="list-style: none;">In the waitlist:<li ng-repeat="wait in mywaitlists"><i class="mdi mdi-alert-circle-outline mdi-18px mdi-dark" style="color:red;"></i> {{ wait.date | date: \'EEEE M/dd/yyyy\' }}</li></ul></md-content></div></md-content></md-tab><md-tab label="Account"><md-content class="md-padding"><div layout="row" layout-align="center top" class="container"><md-content layout-padding=""><form name="profile" ng-submit="saveProfile()" novalidate=""><div layout="row"><md-input-container flex="50"><label>First name</label> <input ng-model="currentUser.first_name" type="text" ng-disabled="true"></md-input-container><md-input-container flex="50"><label>Last name</label> <input ng-model="currentUser.last_name" type="text" ng-disabled="true"></md-input-container></div><div layout="row"><md-input-container flex="100"><label>Email</label> <input ng-model="currentUser.email" type="email" ng-disabled="true"></md-input-container></div><div layout="column"><md-input-container><md-checkbox md-no-ink="" aria-label="Checkbox No Ink" ng-model="currentUser.SMS" class="md-primary"><span style="font-size: 13px;color: rgba(0,0,0,0.54)">Agree to receive text notifications.</span></md-checkbox></md-input-container><md-input-container ng-hide="!currentUser.SMS" flex=""><label>Mobile</label> <input name="mobile" ng-model="currentUser.mobile" ng-required="currentUser.SMS" minlength="12" maxlength="12" ng-pattern="/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"><div class="hint">###-###-####</div></md-input-container></div><div><md-button class="md-primary md-raised" ng-disabled="profile.$invalid" type="submit">Save</md-button></div></form></md-content></div></md-content></md-tab></md-tabs></md-content></div>');
$templateCache.put('register','<div layout="row" layout-align="center center" class="container"><div flex="30" flex-lg="30" flex-gt-md="30" flex-md="30" flex-sm="40" flex-xs="70"><div layout="column" layout-align="center center"><div><span flex=""></span> <img src="images/logo.png" flex="100"> <span flex=""></span></div></div><div>{{ message }}<form name="registerForm" ng-submit="register()" layout="column" novalidate=""><md-input-container class="md-block"><label>First Name</label> <input ng-model="user.firstname" type="text" ng-required="true"></md-input-container><md-input-container class="md-block"><label>Last Name</label> <input ng-model="user.lastname" type="text" ng-required="true"></md-input-container><md-input-container class="md-block"><label>Email</label> <input ng-model="user.email" type="email" ng-required="true"></md-input-container><md-input-container class="md-block"><label>Password</label> <input ng-model="user.password" type="password" ng-required="true"></md-input-container><md-input-container><md-checkbox md-no-ink="" aria-label="Checkbox No Ink" ng-model="currentUser.SMS" class="md-primary"><span style="font-size: 13px;color: rgba(0,0,0,0.54)">Agree to receive text notifications.</span></md-checkbox></md-input-container><md-input-container ng-hide="!currentUser.SMS" flex=""><label>Mobile</label> <input name="mobile" ng-model="currentUser.mobile" ng-required="currentUser.SMS" minlength="12" maxlength="12" ng-pattern="/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"><div class="hint">###-###-####</div></md-input-container><div layout="row"><md-button class="md-raised md-primary" type="submit" ng-disabled="registerForm.$invalid" flex="100">Sign up</md-button><md-button ng-href="#/login">Login</md-button></div></form></div></div></div>');
$templateCache.put('resetpassword','<div layout="row" layout-align="center center" class="container"><div flex="50" flex-lg="40" flex-gt-md="40" flex-md="30" flex-sm="40" flex-xs="70"><div layout="column" layout-align="center center"><div style="margin-bottom: 50px;"><img src="images/logo.png" flex="100"></div><div>Enter your email to reset your password.</div></div><div>{{ message }}<form name="resetPassword" layout="column" novalidate=""><md-input-container class="md-block"><label>Email</label> <input ng-model="user.email" type="email" ng-required="true"></md-input-container><div layout="row"><md-button class="md-warn md-raised md-hue-2" ng-click="passwordReset()" ng-disabled="resetPassword.$invalid" flex="80">Reset Password</md-button><md-button ng-href="#/login">Login</md-button></div></form></div></div></div>');
$templateCache.put('sidenav','<md-sidenav class="md-sidenav-right" md-component-id="right" md-whiteframe="2"><md-toolbar class="md-hue-2"><div class="md-toolbar-tools"><h3>Menu</h3></div></md-toolbar><md-menu-item><md-button ng-href="#/" ng-click="closeSidebar()">Home</md-button></md-menu-item><md-menu-item><md-button ng-href="#/about" ng-click="closeSidebar()">About</md-button></md-menu-item><md-menu-item><md-button ng-href="#/faq" ng-click="closeSidebar()">FAQ</md-button></md-menu-item><md-divider></md-divider><md-menu-item ng-if="!currentUser"><md-button ng-href="#/login" ng-click="closeSidebar()">Login</md-button></md-menu-item><md-menu-item ng-if="currentUser"><md-button ng-href="#/myprofile" ng-click="closeSidebar()">My Profile</md-button></md-menu-item><md-menu-item ng-if="currentUser"><md-button ng-click="logout()">Logout</md-button></md-menu-item></md-sidenav>');
$templateCache.put('directives/ballnightactions.dir','<md-button ng-click="checkin()">Add me</md-button><md-button>Remove me</md-button>');
$templateCache.put('directives/players.dir','<md-chips ng-model="players" readonly="true"><md-chip-template>{{ $chip.first_name }} {{ $chip.last_name}}</md-chip-template></md-chips>');
$templateCache.put('directives/playerstatus.dir','<i class="mdi mdi-check-circle-outline mdi-18px mdi-dark" style="color:green;" ng-if="playerInRoster.value"></i> <i class="mdi mdi-alert-circle-outline mdi-18px mdi-dark" style="color:red;" ng-if="playerInWaitlist.value"></i>');
$templateCache.put('directives/rostercount.dir','<span ng-if="rostercount">R: {{ rostercount }}</span>');
$templateCache.put('directives/waitlist.dir','<md-chips ng-model="waitlistplayers" readonly="true"><md-chip-template>{{ $chip.first_name }} {{ $chip.last_name}}</md-chip-template></md-chips>');
$templateCache.put('directives/waitlistcount.dir','<span ng-if="waitlistcount">/ W: {{ waitlistcount }}</span>');}]);