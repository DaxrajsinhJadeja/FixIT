import { Button, Col, Row, Form, Input, TimePicker } from "antd";
import { toast } from "react-hot-toast";
import React, { useEffect } from "react";
import moment from "moment";

function FixerForm({ onFinish, initialValues }) {
  const validatePincode = (rule, value, callback) => {
    const pincodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!pincodeRegex.test(value)) {
      callback("Pincode must be in the format 'A1A 1A1'");
    } else {
      callback();
    }
  };
  useEffect(() => {
    const addressInput = document.getElementById("address");
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInput,
      {
        types: ["geocode"],
        componentRestrictions: { country: "ca" }, // Restrict to Canada
      }
    );

    // Listen for the 'place_changed' event to get the selected place
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        toast.error(
          "No address selected from the suggestions. Please choose a valid address."
        );
        return;
      }
      const address = place.formatted_address;
      addressInput.value = address;
    });
  }, []);

  // Function to handle address change and restrict to Canada
  const handleAddressChange = (value) => {
    const addressComponents = value.address_components;
    if (addressComponents && Array.isArray(addressComponents)) {
      const countryComponent = addressComponents.find((component) =>
        component.types.includes("country")
      );
      if (countryComponent && countryComponent.short_name !== "CA") {
        toast.error("Please select a location within Canada.");
        return;
      }
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        ...(initialValues && {
          timings: [
            moment(initialValues?.timings[0], "HH:mm"),
            moment(initialValues?.timings[1], "HH:mm"),
          ],
        }),
      }}
    >
      <h1 className="card-title mt-3">Personal Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Website"
            name="website"
            rules={[{ required: true }]}
          >
            <Input placeholder="Website" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Pincode"
            name="pincode"
            rules={[
              { required: true, message: "Please enter your pincode." },
              { validator: validatePincode },
            ]}
          >
            <Input placeholder="Pincode" />
          </Form.Item>
        </Col>
      </Row>
      {/* Other form fields */}
      {/* <div className="mb-3">
            <label htmlFor="address" className="form-label" name="address">
              Address
            </label>
            <Input id="address" name="address" placeholder="Address" />
          </div>
        </Col>
      </Row> */}
      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Fee Per Cunsultation"
            name="feePerCunsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee Per Cunsultation" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Timings"
            name="timings"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          SUBMIT
        </Button>
      </div>
    </Form>
  );
}

export default FixerForm;
