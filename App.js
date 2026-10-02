import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, TextInput } from 'react-native';

export default function App() {
  // Screen and Category Tabs
  const [tab, setTab] = useState('Shop');
  const [category, setCategory] = useState('Indoor');
  
  // Basket Financial Values
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [promoInput, setPromoInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [distance, setDistance] = useState(5); 
  
  // Delivery Configurations
  const [discreet, setDiscreet] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const [driverApproved, setDriverApproved] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [step, setStep] = useState('Received');

  const MIN_ORDER = 350;

  // Add Item Triggers
  const addIndoorItem = () => {
    setCartCount(cartCount + 1);
    setCartTotal(cartTotal + 120);
    Alert.alert('Basket Updated', 'Premium Indoor Strain (R120) added.');
  };

  const addGreenhouseItem = () => {
    setCartCount(cartCount + 1);
    setCartTotal(cartTotal + 80);
    Alert.alert('Basket Updated', 'Greenhouse Strain (R80) added.');
  };

  const addOutdoorItem = () => {
    setCartCount(cartCount + 1);
    setCartTotal(cartTotal + 45);
    Alert.alert('Basket Updated', 'Local Outdoor Strain (R45) added.');
  };

  // Promo Code Validation
  const handleApplyPromo = () => {
    if (cartTotal < MIN_ORDER) {
      Alert.alert('Minimum Order Required', 'Add items worth R350 or more first.');
      return;
    }
    if (promoInput.trim().toUpperCase() === 'PUFF50') {
      setDiscount(50);
      Alert.alert('Promo Verified', 'R50 referral discount successfully applied!');
    } else {
      Alert.alert('Invalid Entry', 'Try active code: PUFF50');
    }
  };

  // Delivery Calculations
  const finalSubtotal = Math.max(0, cartTotal - discount);
  let fee = 0;
  if (finalSubtotal < MIN_ORDER && distance > 10) {
    fee = 35;
  }
  const grandTotal = finalSubtotal > 0 ? finalSubtotal + fee : 0;

  // Checkout Constraints Validation
  const handleCheckout = () => {
    if (cartTotal < MIN_ORDER) {
      Alert.alert('Checkout Blocked', 'Minimum order value must be at least R350.');
      return;
    }
    if (!idUploaded) {
      Alert.alert('ID Required', 'Age verification compliance requires an upfront ID upload.');
      return;
    }
    if (distance > 20) {
      Alert.alert('Out of Delivery Range', 'Maximum delivery radius is 20km.');
      return;
    }
    setOrderPlaced(true);
    setStep('Received');
    Alert.alert('Success 🎉', 'Order received! Sent to tracking pipeline.');
  };

  const handleReset = () => {
    setCartCount(0);
    setCartTotal(0);
    setDiscount(0);
    setPromoInput('');
    setOrderPlaced(false);
    setDriverApproved(false);
    setStep('Received');
  };

  return (
    <View style={styles.window}>
      <View style={styles.navHeader}>
        <Text style={styles.titleText}>Puff to Go 🍃</Text>
      </View>

      <ScrollView style={styles.bodyScroll}>
        {/* SHOP FRONT VIEW */}
        {tab === 'Shop' && (
          <View>
            <Text style={styles.headLabel}>Menu Categories</Text>
            <View style={styles.rowBox}>
              <TouchableOpacity style={[styles.pillBtn, category === 'Indoor' && styles.pillActive]} onPress={() => setCategory('Indoor')}>
                <Text style={styles.pillText}>Indoor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pillBtn, category === 'Greenhouse' && styles.pillActive]} onPress={() => setCategory('Greenhouse')}>
                <Text style={styles.pillText}>Greenhouse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pillBtn, category === 'Outdoor' && styles.pillActive]} onPress={() => setCategory('Outdoor')}>
                <Text style={styles.pillText}>Outdoor</Text>
              </TouchableOpacity>
            </View>

            {category === 'Indoor' && (
              <View style={styles.itemRow}>
                <View style={{flex:1}}>
                  <Text style={styles.itemName}>Premium Indica AAA</Text>
                  <Text style={styles.itemDesc}>Dense indoor-grown frosted buds.</Text>
                  <Text style={styles.itemPrice}>R 120</Text>
                </View>
                <TouchableOpacity style={styles.addPill} onPress={addIndoorItem}><Text style={styles.addText}>+ Add</Text></TouchableOpacity>
              </View>
            )}

            {category === 'Greenhouse' && (
              <View style={styles.itemRow}>
                <View style={{flex:1}}>
                  <Text style={styles.itemName}>Blue Dream Hybrid</Text>
                  <Text style={styles.itemDesc}>Perfect balance with sweet berry hints.</Text>
                  <Text style={styles.itemPrice}>R 80</Text>
                </View>
                <TouchableOpacity style={styles.addPill} onPress={addGreenhouseItem}><Text style={styles.addText}>+ Add</Text></TouchableOpacity>
              </View>
            )}

            {category === 'Outdoor' && (
              <View style={styles.itemRow}>
                <View style={{flex:1}}>
                  <Text style={styles.itemName}>Northern Lights Natural</Text>
                  <Text style={styles.itemDesc}>Sun-grown smooth local favorite.</Text>
                  <Text style={styles.itemPrice}>R 45</Text>
                </View>
                <TouchableOpacity style={styles.addPill} onPress={addOutdoorItem}><Text style={styles.addText}>+ Add</Text></TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* SHOPPING BASKET CHECKOUT VIEW */}
        {tab === 'Cart' && (
          <View>
            {!orderPlaced ? (
              <View style={styles.cardPanel}>
                <Text style={styles.headLabel}>Your Checkout Basket</Text>
                <Text style={styles.whiteInfo}>Total Items Added: {cartCount}</Text>
                <Text style={styles.whiteInfo}>Subtotal Balance: R {cartTotal}</Text>
                
                <View style={styles.lineSplit} />

                <View style={styles.rowBox}>
                  <TextInput 
                    style={styles.fieldBox} 
                    placeholder="Enter R50 Share Code" 
                    placeholderTextColor="#777"
                    value={promoInput}
                    onChangeText={setPromoInput}
                  />
                  <TouchableOpacity style={styles.actionBtn} onPress={handleApplyPromo}><Text style={styles.addText}>Apply</Text></TouchableOpacity>
                </View>

                {discount > 0 && <Text style={styles.greenInfo}>✓ Referral Discount Linked: -R 50</Text>}

                <View style={styles.lineSplit} />

                <View style={styles.rowToggle}>
                  <View style={{flex:1}}>
                    <Text style={styles.boldText}>Discreet Drop-off Config</Text>
                    <Text style={styles.greyText}>Unmarked packaging & quiet drop</Text>
                  </View>
                  <Switch value={discreet} onValueChange={setDiscreet} />
                </View>

                <View style={styles.rowToggle}>
                  <View style={{flex:1}}>
                    <Text style={styles.boldText}>Upfront Identification Upload</Text>
                    <Text style={styles.greyText}>Mandatory age compliance attachment</Text>
                  </View>
                  <TouchableOpacity style={[styles.actionBtn, idUploaded && {backgroundColor: '#1b5e20'}]} onPress={() => { setIdUploaded(true); Alert.alert('Asset Uploaded', 'Digital ID saved.'); }}>
                    <Text style={styles.addText}>{idUploaded ? '✓ Loaded' : 'Upload ID'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.boldText}>Simulate Store Distance Radius:</Text>
                <View style={styles.rowBox}>
                  <TouchableOpacity style={[styles.pillBtn, distance === 5 && styles.pillActive]} onPress={() => setDistance(5)}><Text style={styles.pillText}>5km (Free)</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.pillBtn, distance === 15 && styles.pillActive]} onPress={() => setDistance(15)}><Text style={styles.pillText}>15km (R35)</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.pillBtn, distance === 25 && styles.pillActive]} onPress={() => setDistance(25)}><Text style={styles.pillText}>25km (Block)</Text></TouchableOpacity>
                </View>

                <View style={styles.lineSplit} />
                <Text style={styles.whiteInfo}>Selected Distance Profile: {distance} km</Text>
                <Text style={styles.whiteInfo}>Fulfillment Charge: {distance > 20 ? 'Out of Range' : fee === 0 ? 'FREE' : `R ${fee}`}</Text>
                <Text style={styles.grandText}>Grand Total Due: R {grandTotal}</Text>

                {cartTotal < MIN_ORDER && <Text style={styles.warnText}>⚠️ Minimum checkout threshold value of R350 required.</Text>}

                <TouchableOpacity style={[styles.submitBtn, (cartTotal < MIN_ORDER || distance > 20) && {backgroundColor:'#444'}]} onPress={handleCheckout} disabled={cartTotal < MIN_ORDER || distance > 20}>
                  <Text style={styles.addText}>Place Order (R {grandTotal})</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cardPanel}>
                <Text style={styles.headLabel}>📍 Real-time Order Pipelines</Text>
                <Text style={styles.greyText}>Active GPS map coordinates disabled for driver privacy.</Text>
                
                <View style={{marginVertical: 15}}>
